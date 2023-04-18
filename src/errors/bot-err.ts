import { IBotError } from "../interfaces/bot-err.js";

export default class BotError extends Error {

    to;

    constructor({ error }: IBotError){

        super();

        this.message = error;

    }


}