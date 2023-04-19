import whatsapp from 'whatsapp-web.js';
import UsersManager from '../lib/users-manager.js';
import { ChatMessage } from 'chatgpt';

export interface ILordBot {

    readonly name: string;

    owner: ILordOwnerConstuctor;

    userManager: UsersManager;

    gptRequest: boolean;

    initialize(): Promise<void>;

    sendMessage(number: string, message: string, options?: { withAudio: boolean }): Promise<void>;

    onState(states: IlordBotStates[]): void;

    gpt(message: string, { type }: IGpt): Promise<string | ChatMessage>;

}

export interface ILordBotConstructor {

    name: string;
    owner: ILordOwnerConstuctor;
    multiplyUsers?: boolean

}

export interface StateExecution {

    (params: { user: { number: string, stateChanger(state: string): void, currentState: string, message: string } }): any;

}

export interface IlordBotStates {

    //* Name of an state */
    name: string;
     /**
           Function that performs a certain action according to the current state of a user
      */
    execute: StateExecution
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





