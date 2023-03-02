import { IBotError } from "../interfaces/bot-err";

export default class BotError extends Error {

    to;

    constructor({ to, message }: IBotError){

        super(message);

        this.to = to;

    }


}