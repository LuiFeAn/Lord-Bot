
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

}

export interface ILordOWnerPropsWithState extends IlordOwnerProps {

    state: string

}
