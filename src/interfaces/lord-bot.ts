import { Contact } from 'whatsapp-web.js';
import UserManagment from '../lib/users-management';

export interface ILordBot {



}

export interface ILordBotConstructor {

    name: string;
    owner: ILordOWnerPropsWithState;
    multiplyUsers?: UserManagment | false;

}

export interface IlordBotStates {

    name: string;
    forAnyState?: boolean
    execute: ({number,message,contacts}: { number: string, message: string, contacts: Contact []}) => any
}

export interface IlordOwnerProps {

    number: string,
    contacts?: Contact []

}

export interface ILordOWnerPropsWithState extends IlordOwnerProps {

    state: string

}


