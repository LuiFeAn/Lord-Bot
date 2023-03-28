import { Contact } from 'whatsapp-web.js';

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
    owner: ILordOwnerConstuctor;
    multiplyUsers?: boolean

}

export interface IlordBotStates {

    name: string;
    execute: ({ user, owner }: { user: {
        number: string,
        stateChanger(state: string): void,
        message: string
    }, owner: ILordOwnerConstuctor }) => any
}


export interface ILordOwnerConstuctor  {

   contacts?: Contact []

   number: string;

}


