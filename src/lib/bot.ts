import { whatsProvider } from "../providers/whatsapp-provider";

import { ILordBot, IlordBotStates } from '../interfaces/lord-bot';

import { whatsEvents } from '../events/whatsapp-events';

import whatsListener from "../listeners/whatsapp-listener";

class LordBot {

    private name
    owner
    private states: IlordBotStates []

    constructor( { name, owner, states }: ILordBot ){

        this.name = name;
        this.owner = owner
        this.states = states

    }

    async initialize(){

        whatsProvider.initialize();

        whatsListener(this.owner,this.stateManager);

    }

    say(number: string, message: string){

        whatsProvider.sendMessage(number,message);

    }

    stateManager(){

        this.states.forEach( state => {

            const { name, execute } = state;

            if( this.owner.state === name ){

                execute(this.owner.message!);

            }

        })

    }



}

export default LordBot