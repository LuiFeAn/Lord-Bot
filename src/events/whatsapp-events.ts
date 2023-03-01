import { Message, ClientSession } from "whatsapp-web.js";

import { IlordOwnerProps } from "../interfaces/lord-bot";

import qrcode from 'qrcode-terminal';

export const whatsEvents = {

     onReady(){

        console.log('O LordBOT está preparado para uso');

    },

     onQrCode(code: string){

        console.log('Por favor, utilize o QrCODE abaixo para vincular seu número ao LordBOT')

        qrcode.generate(code,{
            small:true
        });

    },

     onAuth(client: ClientSession){
        
        console.log('LordBot foi autenticado com sucesso');

    },

     onFail(message: string){

        console.log('Um erro ocorreu durante o vinculo do LordBOT ao sue número');

    },

    onMessage (message: Message, owner: IlordOwnerProps, stateManager: any){

        const { from: number, body } = message;

        owner.message = body;

        if( number ===  owner.number ){

            stateManager();

        }

    }

}