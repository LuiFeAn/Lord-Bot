import { Contact } from 'whatsapp-web.js';

export interface ILordBot {

    name: string;
    owner: ILordOWnerPropsWithState;

}

export interface IlordBotStates {

    name: string;
    execute: (owner: IlordOwnerProps) => any
}

export interface IlordOwnerProps {

    number: string,
    message?: string,
    contacts?: Contact []

}

export interface ILordOWnerPropsWithState extends IlordOwnerProps {

    state: string

}
