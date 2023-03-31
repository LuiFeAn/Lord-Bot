import { whatsProvider } from "../providers/whatsapp-provider";

import { ILordBot, ILordBotConstructor, IlordBotStates } from '../interfaces/lord-bot';

import qrcode from 'qrcode-terminal';

import { IBotError } from "../interfaces/bot-err";
import { Message } from "whatsapp-web.js";

import env from 'dotenv';
import { IUser } from "../interfaces/user-magagment";

import UsersManager from "./users-manager";

env.config();

class LordBot implements ILordBot {

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

        whatsProvider.on('message', (message: Message) => {

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

    //** Function executed whenever a user sends a message, regardless of the current state. A state is basically the level where a user is  */
    onAnyState(state: IlordBotStates ){

        state.name = 'options';

        this.states.push(state);

    }

    /** Update owner state */
    stateChanger(number: string, state: string){

        const user = this.userManager.getUser(number);

        user!.state = state;

    }


}

export default LordBot
