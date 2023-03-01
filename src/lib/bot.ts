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

        this.owner.contacts = []

    }

    /** Inicializa o bot e todos seus recursos */
    async initialize(){

        await whatsListener(this.owner, () => this.stateManager( this.states ));

        if( this.owner.contacts?.length === 0 ){

            this.owner.contacts = await whatsProvider.getContacts();

        }

    }

    /** Envia uma mensagem ao número específicado */
    async say(number: string, message: string){

        whatsProvider.sendMessage(number,message);

    }

    /** Gerencia os estados criados */
    private stateManager(states: IlordBotStates []){

        const { state, ...rest } = this.owner;

        const anyState = states.find( state => (
            state.name
        ));

        if( anyState ){

            anyState.execute(rest);

        }

        states.forEach(  async state => {

            const { name, execute } = state;

            if( this.owner.state === name ){

                execute(rest);

            }

        })

    }

    /** Cria novos estados */
    stateCreator(states: IlordBotStates []){

        this.states = states;

    }

    /** Atualiza o estado do owner */
    stateChanger(state: string){

        this.owner.state = state;

    }

    inAnyState(){



    }



}

export default LordBot
