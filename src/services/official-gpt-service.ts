import { officialGpt } from "../providers/chatgpt-provider.js";
import { ChatMessage } from "chatgpt";
import dotenv from 'dotenv';
import BotError from "../errors/bot-err.js";

dotenv.config();


export default {

    sendQuestion(message: string): Promise<ChatMessage> | string{

        if( !process.env.OPENAI_API_KEY ){

            throw new BotError({
                error:'No key has been defined so that I can connect to the OpenAI API'
            });

        }

        const response = officialGpt.sendMessage(message);

        return response;

    }

}