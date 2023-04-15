import { whatsProvider } from '../providers/whatsapp-provider.js';

import { ILordBot, ILordBotConstructor, IlordBotStates, IGpt } from '../interfaces/lord-bot.js';

import qrcode from 'qrcode-terminal';

import { IBotError } from '../interfaces/bot-err.js';

import whatsapp from "whatsapp-web.js";

import env from 'dotenv';

import { IUser } from '../interfaces/user-magagment.js';

import UsersManager from './users-manager.js';

import officialGptService from '../services/official-gpt-service.js';

import unofficialGptService from "../services/unofficial-gpt-service.js";

env.config();

export default class LordBot implements ILordBot {

    name

    owner;

    private states: IlordBotStates []

    private multiplyUsers;

    userManager: UsersManager;

    constructor( { name, owner, multiplyUsers }: ILordBotConstructor  ){

        this.name = name;

        this.owner = owner;

        this.owner.number = `${owner.number}@c.us`;

        this.states = [];

        this.owner.contacts = [];

        this.multiplyUsers = multiplyUsers;

        this.userManager = new UsersManager();


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
    
                        const userRole = this.owner.number === number ? 
                        'admin' : 
                        'common_user';
    
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


    /** Send a message to the specified number */
    async say(number: string, message: string){

        whatsProvider.sendMessage(number,message);

    }

    /** Manages created states */
    private async stateManager(user: IUser  ){

        const { state, number, message } = user;

        const execiton = () => {

            return {

                user: {
                    number,
                    stateChanger: (state: string) => {

                        this.stateChanger(number,state);

                    },
                    message,
                },
                owner: this.owner,

            }

        }

        try {


            const anyState = this.states.find( state => state.name === 'options');

            if( anyState ){

                anyState.execute(execiton())

            }

            this.states.forEach(  async st => {

                const { name, execute } = st;

                if( state === name ){

                    execute(execiton());

                }

            });


        } catch(err){

            const error = (err as IBotError)

            const { to, message } = error;

            await this.say(to,message);


        }

    }

    /** Create states */
    onState(states: IlordBotStates []){

        this.states = states;

    }


    /** Use an API linked to chatGPT to answer different questions */
    gpt(message: string, { type }: IGpt){

       const verifyType = {

        'official': async () => {


            if( !process.env.OPENAI_API_KEY ){

                return 'No key has been defined so that I can connect to the OpenAI API'

            }

            const response = await officialGptService.sendQuestion(message);

            return response.text;

        },

        'unofficial': async () => {

            if( !process.env.OPENAI_ACESS_TOKEN ){

                return 'No access token set so I can connect to OpenAI services'

            }

            const response = await unofficialGptService.sendQuestion(message);

            return response.text;

        }

    }

    return verifyType[type]();

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

