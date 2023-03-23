import { Contact } from 'whatsapp-web.js';
import UserManagment from '../lib/users-manager';

export interface ILordBot {

    name: string;

    initialize(): void;

    say(number: string, message: string): Promise<void>

    onState(states: IlordBotStates []): void

    onAnyState(state: IlordBotStates): void

    stateChanger(number: string, state: string): void



}

export interface ILordBotConstructor {

    name: string;
    owner: ILordOWnerPropsWithState;
    multiplyUsers?: UserManagment | false;

}

export interface IlordBotStates {

    name: string;
    execute: ({ user }: { user: {
        number: string,
        stateChanger(state: string): void,
        message: string
    }}) => any
}

export interface IlordOwnerProps {

    number: string,
    contacts?: Contact []

}


export interface ILordOWnerPropsWithState extends IlordOwnerProps {

    state: string

}


