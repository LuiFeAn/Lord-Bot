import whatsapp from 'whatsapp-web.js';

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





