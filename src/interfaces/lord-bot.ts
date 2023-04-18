import whatsapp from 'whatsapp-web.js';
import UsersManager from '../lib/users-manager.js';
import { ChatMessage } from 'chatgpt';

export interface ILordBot {

    name: string;

    owner: ILordOwnerConstuctor;

    userManager: UsersManager;

    gptRequest: boolean;

    initialize(): Promise<void>;

    sendMessage(number: string, message: string, options?: { withAudio: boolean }): Promise<void>;

    replyMessage(): Promise<void>;

    onState(states: IlordBotStates[]): void;

    gpt(message: string, { type }: IGpt): Promise<string | ChatMessage>;

}

export interface ILordBotConstructor {

    name: string;
    owner: ILordOwnerConstuctor;
    multiplyUsers?: boolean

}

export interface IlordBotStates {

    name: string;
     /** 
           Function that performs a certain action according to the current state of a user
      */
    execute: ({ user }: { user: {
        number: string,
        /** 
            Switches the current state of a user to another state
         */
        stateChanger(state: string): void,
        currentState: string
        message: string
    }}) => any
}


export interface ILordOwnerConstuctor  {

   contacts?: whatsapp.Contact []

   number: string;

}

export interface IGpt {

    /** 
           Defines which type of API you would like to use. The "Official" uses the official OpenAI server, the "unofficial" uses a third-party proxy
      */
    type: 'official' | 'unofficial'

}


