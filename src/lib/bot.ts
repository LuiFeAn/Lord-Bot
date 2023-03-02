import { whatsProvider } from "../providers/whatsapp-provider";

import { ILordBot, IlordBotStates } from '../interfaces/lord-bot';

import whatsListener from "../listeners/whatsapp-listener";
import BotError from "../errors/bot-err";
import { IBotError } from "../interfaces/bot-err";

class LordBot {

    name

    private owner

    private states: IlordBotStates []

    constructor( { name, owner }: ILordBot ){

        this.name = name;

        this.owner = owner;

        this.owner.number = `${owner.number}@c.us`;

        this.states = [];

        this.owner.contacts = [];

    }

    /** Initializes the bot and all its resources */
    async initialize(){

        await whatsListener(this.owner, () => this.stateManager( this.states ));

        if( this.owner.contacts?.length === 0 ){

            this.owner.contacts = await whatsProvider.getContacts();

        }

    }

    /** Send a message to the specified number */
    async say(number: string, message: string){

        whatsProvider.sendMessage(number,message);

    }

    /** Manages created states */
    private async stateManager(states: IlordBotStates []){

        const { state, ...rest } = this.owner;

        const anyState = states.find( state => (
            state.forAnyState === true
        ));

        if( anyState ){

            try {

                anyState.execute(rest)

            }catch(err){

                const error = (err as IBotError)

                const { to, message } = error;

                await this.say(to,message);


            }


        }

        states.forEach(  async state => {

            const { name, execute } = state;

            if( this.owner.state === name ){

                execute(rest);

            }

        })

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
