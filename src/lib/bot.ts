import qrcode from 'qrcode-terminal';

import { whatsProvider } from "../providers/whatsapp-provider";

import { ClientSession, Message } from 'whatsapp-web.js';

import { ILordBot, IlordBotStates } from '../interfaces/lord-bot';

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

        function onReady(){

            console.log('O LordBOT está preparado para uso');
    
        }
    
        function onQrCode(code: string){
    
            console.log('Por favor, utilize o QrCODE abaixo para vincular seu número ao LordBOT')
    
            qrcode.generate(code,{
                small:true
            });
    
        }
    
        function onAuth(client: ClientSession){
            
            console.log('LordBot foi autenticado com sucesso');
    
        }
    
        function onFail(message: string){
    
            console.log('Um erro ocorreu durante o vinculo do LordBOT ao sue número');
    
        }
    
        const onMessage = (message: Message) => {
    
            const { from: number, body } = message;

            if( number === this.owner.number ){

                this.stateVerification();

            }
            
    
        }

        whatsProvider.on('qr',onQrCode);

        whatsProvider.on('authenticated',onAuth);

        whatsProvider.on('auth_failure',onFail);

        whatsProvider.on('ready',onReady);

        whatsProvider.on('message',onMessage);

    }

    say(number: string, message: string){

        whatsProvider.sendMessage(number,message);

    }

    stateVerification(){

        this.states.forEach( state => {

            const { name, execute } = state;

            if( this.owner.state === name ){

                execute();

            }

        })

    }

    messageRecivied(){

    }



}

export default LordBot