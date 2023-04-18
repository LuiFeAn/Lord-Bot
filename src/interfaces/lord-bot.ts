import whatsapp from 'whatsapp-web.js';

export interface ILordBot {

    name: string;

    initialize(): void;

    sendMessage(number: string, message: string, options?: { withAudio: boolean }): Promise<void>

    onState(states: IlordBotStates []): void

    onAnyState(state: IlordBotStates): void

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


