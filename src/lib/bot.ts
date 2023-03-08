import { whatsProvider } from "../providers/whatsapp-provider";

import { ILordBot, ILordBotConstructor, IlordBotStates } from '../interfaces/lord-bot';
import UserManagment from "./users-management";

import qrcode from 'qrcode-terminal';

import { IBotError } from "../interfaces/bot-err";
import { Message } from "whatsapp-web.js";

import env from 'dotenv';
import { IUser } from "../interfaces/user-magagment";

env.config();

class LordBot implements ILordBot {

    name

    private owner;

    private states: IlordBotStates []

    private multiplyUsers: UserManagment | false;

    constructor( { name, owner, multiplyUsers }: ILordBotConstructor  ){

        this.name = name;

        this.owner = owner;

        this.owner.number = `${owner.number}@c.us`;

        this.states = [];

        this.owner.contacts = [];

        this.multiplyUsers = multiplyUsers instanceof UserManagment ? multiplyUsers : false;


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

            let otherUser: IUser | undefined;

            if( this.multiplyUsers && number != this.owner.number ){

                const userInMemory  = this.multiplyUsers.getUser(number);

                if( !userInMemory ){

                    this.multiplyUsers.addUser({
                        number,
                        state: process.env.INITIAL_STATE as string,
                    })

                }

                otherUser = this.multiplyUsers.getUser(number);

            }

            let state = this.multiplyUsers ? this.owner.state : otherUser!.state;


            if( number === this.owner.number || this.multiplyUsers ){

                this.stateManager(number,body,state);

            }

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
    private async stateManager(number: string,message: string, state: string){

        try {


            const anyState = this.states.find( state => (
                state.forAnyState === true
            ));

            if( anyState ){

                anyState.execute({
                    number,
                    message,
                    contacts: this.owner.contacts!
                })

            }

            this.states.forEach(  async state => {

                const { name, execute } = state;

                if( this.owner.state === name ){

                    return execute({
                        number,
                        message,
                        contacts: this.owner.contacts!
                    });

                }

            });


        }catch(err){

            const error = (err as IBotError)

            const { to, message } = error;

            await this.say(to,message);


        }

    }

    /** Create new states */
    stateCreator(states: IlordBotStates []){

        this.states = states;

    }

    /** Update owner state */
    stateChanger(state: string){

        this.owner.state = state;

    }


}

export default LordBot
