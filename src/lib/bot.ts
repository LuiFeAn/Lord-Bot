import { whatsProvider } from "../providers/whatsapp-provider";

import { ILordBot, IlordBotStates } from '../interfaces/lord-bot';

import whatsListener from "../listeners/whatsapp-listener";

class LordBot {

    name

    private owner

    private states: IlordBotStates []

    constructor( { name, owner }: ILordBot ){

        this.name = name;

        this.owner = owner

        this.states = [];

    }

    async initialize(){

        whatsListener(this.owner, () => this.stateManager( this.states ));

    }

    say(number: string, message: string){

        whatsProvider.sendMessage(number,message);

    }

    private stateManager(states: IlordBotStates []){

        states.forEach( state => {

            const { name, execute } = state;

            if( this.owner.state === name ){

                const { state, ...rest } = this.owner;

                execute(rest);

            }

        })

    }

    stateCreator(states: IlordBotStates []){

        this.states = states;

    }

    stateChanger(state: string){

        this.owner.state = state;

    }



}

export default LordBot