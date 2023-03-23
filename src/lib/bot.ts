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

    private multiplyUsers: UsersManager | false;

    constructor( { name, owner, multiplyUsers }: ILordBotConstructor  ){

        this.name = name;

        this.owner = owner;

        this.owner.number = `${owner.number}@c.us`;

        this.states = [];

        this.owner.contacts = [];

        this.multiplyUsers = multiplyUsers instanceof UsersManager ? multiplyUsers : false;


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

            const { from: number, body } = message;

            let currentUserInfos: IUser | undefined;

            if( this.multiplyUsers ){

                const  createFindOrUpdateUser = (): void => {

                    if( this.multiplyUsers instanceof UsersManager ){

                       currentUserInfos = this.multiplyUsers.getUser(number);

                    }

                    if( !currentUserInfos ){

                        const userRole = this.owner.number === number ? 'admin' : 'common_user';

                        if( this.multiplyUsers instanceof UsersManager ){

                            this.multiplyUsers.addUser({
                                number,
                                state: process.env.INITIAL_STATE as string,
                                role: userRole,
                                message: body
                            });

                        }

                        return createFindOrUpdateUser();

                    }


                }

                const state = this.multiplyUsers ? this.owner.state : currentUserInfos!.state;

                console.log(currentUserInfos);

                currentUserInfos!.state = state;

                currentUserInfos!.message = body;

                createFindOrUpdateUser();


            }

            this.stateManager(currentUserInfos!);

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
    private async stateManager(user: IUser){

        const { state, number, message } = user;

        try {


            const anyState = this.states.find( state => (
                state.name === 'options'
            ));

            if( anyState ){

                anyState.execute({

                    user: {
                        number,
                        stateChanger: (state: string) => {

                            this.stateChanger(number,state);

                        },
                        message,
                    }

                })

            }

            this.states.forEach(  async st => {

                const { name, execute } = st;

                if( state === name ){

                    return execute({

                        user: {
                            number,
                            stateChanger: (state: string) => {

                                this.stateChanger(number,state);

                            },
                            message,
                        },

                    });

                }

            });


        }catch(err){

            const error = (err as IBotError)

            const { to, message } = error;

            await this.say(to,message);


        }

    }

    /** Create states */
    onState(states: IlordBotStates []){

        this.states = states;

    }

    //** Create a state that execute in any moment  */
    onAnyState(state: IlordBotStates ){

        state.name = 'options';

        this.states.push(state);

    }

    /** Update owner state */
    stateChanger(number: string, state: string){

        if( this.multiplyUsers instanceof UsersManager ){

            const user = this.multiplyUsers.getUser(number);

            user!.state = state;

        }

    }


}

export default LordBot
