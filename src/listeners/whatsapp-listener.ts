import { IlordOwnerProps } from "../interfaces/lord-bot";

import { whatsProvider } from "../providers/whatsapp-provider";
import { whatsEvents } from "../events/whatsapp-events";

export default function whatsListener(owner: IlordOwnerProps, stateManager: () => any){

    whatsProvider.initialize();

    whatsProvider.on('qr', whatsEvents.onQrCode);

    whatsProvider.on('authenticated', whatsEvents.onAuth);

    whatsProvider.on('auth_failure', whatsEvents.onFail);

    whatsProvider.on('ready', whatsEvents.onReady);

    whatsProvider.on('message', message => whatsEvents.onMessage( message, owner, stateManager ));

}