import { Message, ClientSession } from "whatsapp-web.js";

import { IlordOwnerProps } from "../interfaces/lord-bot";

import qrcode from 'qrcode-terminal';

export const whatsEvents = {

     onReady(){

        console.log('LordBOT is ready for use');

    },

     onQrCode(code: string){

        console.log('Please use the QrCODE below to link your number to LordBOT')

        qrcode.generate(code,{
            small:true
        });

    },

     onAuth(client: ClientSession){

        console.log('LordBot has been successfully authenticated');

    },

     onFail(message: string){

        console.log('An error occurred while linking LordBOT to your number');

    },

    onMessage (message: Message, owner: IlordOwnerProps, stateManager: () => any ){

        const { from: number, body } = message;

        owner.message = body;

        if( number ===  owner.number ){

            stateManager();

        }

    }

}
