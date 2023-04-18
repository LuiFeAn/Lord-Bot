import { whatsProvider } from '../providers/whatsapp-provider.js';

import { ILordBot, ILordBotConstructor, IlordBotStates, IGpt, ILordOwnerConstuctor } from '../interfaces/lord-bot.js';

import qrcode from 'qrcode-terminal';

import { IBotError } from '../interfaces/bot-err.js';

import whatsapp from "whatsapp-web.js";

import Audio from './audio.js';

import env from 'dotenv';

import { IUser } from '../interfaces/user-magagment.js';

import UsersManager from './users-manager.js';

import officialGptService from '../services/official-gpt-service.js';

import unofficialGptService from "../services/unofficial-gpt-service.js";

import BotError from '../errors/bot-err.js';

env.config();

export default class LordBot implements ILordBot {

    name: string

    owner: ILordOwnerConstuctor;

    private states: IlordBotStates []

    private multiplyUsers;

    userManager: UsersManager;

    gptRequest: boolean

    private audioComponent: Audio;

    private audio: boolean

    constructor( { name, owner, multiplyUsers }: ILordBotConstructor  ){

        this.name = name;

        this.owner = owner;

        this.owner.number = `${owner.number}@c.us`;

        this.states = [];

        this.owner.contacts = [];

        this.multiplyUsers = multiplyUsers;

        this.gptRequest = false;

        this.userManager = new UsersManager();

        this.audioComponent = new Audio();
        
        this.audio = false;


    }

    /** Initializes the bot and all its resources */
    async initialize(){

        whatsProvider.on('qr', (code: string) => {

            qrcode.generate(code,{
                small:true
            });

        });

        whatsProvider.on('authenticated', (code: string) => {

            console.log('LordBOT is ready for use');

        });

        whatsProvider.on('auth_failure', () => {

            console.log('An error occurred while linking LordBOT to your number');

        });

        whatsProvider.on('ready', () => {
            console.log('LordBot has been successfully authenticated');
        });

        whatsProvider.on('message', (message: whatsapp.Message) => {

            const { from: number, body, reply } = message;

            const  createFindOrUpdateUser = (): IUser | void => {

                const user = this.userManager.getUser(number);
    
                if( !user ){

                    if( this.multiplyUsers ){
    
                        const userRole = this.owner.number === number ? 'admin' : 'common_user';
                        
                        this.userManager.addUser({
                            number,
                            state: process.env.INITIAL_STATE as string || 'initial',
                            role: userRole,
                            message: body
                        });

                        return createFindOrUpdateUser();
                        
    
                    }

                    if( this.owner.number === number ){

                        this.userManager.addUser({
                            number: this.owner.number,
                            state: process.env.INITIAL_STATE as string,
                            role: 'admin',
                            message: body
                        });

                        return createFindOrUpdateUser();

                    }
    
    
                }

                user!.message = body;
    
                this.stateManager(user!);
    
    
            }

            createFindOrUpdateUser();


        });

        await whatsProvider.initialize();

        if( this.owner.contacts?.length === 0 ){

            this.owner.contacts = await whatsProvider.getContacts();

        }

    }


    /** Send a message to the specified number with audio or text */
    async sendMessage(number: string, message: string, options?: { withAudio: boolean }){

        const validAudioCondition = options?.withAudio || this.audio;

        let media: undefined | Promise<whatsapp.MessageContent>;

        if( validAudioCondition ) {

            media = this.audioComponent.generate(message,'pt-br');

        }

        try{

            whatsProvider.sendMessage(number,validAudioCondition && 
                typeof media != 'undefined' ? await media : message,{
                    sendAudioAsVoice: validAudioCondition ? true : false
                });

        }catch(err){

             throw new BotError({
                error:'An error occurred while sending the message'
             })

        }

    }

    async replyMessage(){

    }

    /** Manages created states */
    private async stateManager(user: IUser  ){

        const { state, number, message } = user;

        const execution = () => {

            return {

                user: {
                    number,
                    stateChanger: (state: string) => this.stateChanger(number,state),
                    message,
                    currentState: state,
                },

            }

        }

        this.states.forEach(  async st => {

            const { name, execute } = st;

            if( state === name ){

                execute(execution());

            }

            if( name === 'options' ){

                execute(execution());
                
            }


        });
        

    }

    /** Create states */
    onState(states: IlordBotStates []){

        this.states = states;

    }


    /** Use an API linked to chatGPT to answer different questions */
    async gpt(message: string, { type }: IGpt){

       if( this.gptRequest ){

            throw new BotError({
                error:'Please wait, a request to the gpt server is already being processed'
            });

       }

        const verifyType = {

            'official': async () => {

                this.gptRequest = true;

                const response = await officialGptService.sendQuestion(message);

                this.gptRequest = false;

                return response;

            },

            'unofficial': async () => {

                this.gptRequest = true;

                const response = await unofficialGptService.sendQuestion(message);

                this.gptRequest = false;

                return response

            }

        }

        try{

            return await verifyType[type]();

        }catch(er){
            
            throw new BotError({
                error:'Unable to connect to OpenAI services at this time'
             })

        }


    }

    //* Defines whether or not the bot can send audio /*
    sendAudio(status: boolean){

        if( typeof status != 'boolean' ){

           throw new BotError({
                error:'Invalid audio status'
           });

        }

        this.audio = status;

    }

    //** Function executed whenever a user sends a message, regardless of the current state. A state is basically the level where a user is  */
    onAnyState(state: IlordBotStates ){

        state.name = 'options';

        this.states.push(state);

    }

    /** Update owner state */
    private stateChanger(number: string, state: string){

        const user = this.userManager.getUser(number);

        user!.state = state;

    }


}

