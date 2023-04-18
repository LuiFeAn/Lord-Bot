import { unofficialGpt } from "../providers/chatgpt-provider.js";
import { ChatMessage } from "chatgpt";
import BotError from "../errors/bot-err.js";
import dotenv from 'dotenv';

dotenv.config();

export default {

    sendQuestion(message: string): Promise<ChatMessage> | string {

        if( !process.env.OPENAI_ACESS_TOKEN ){

            throw new BotError({
                error:'No access token set so I can connect to OpenAI services'
            })

        }

        const response = unofficialGpt.sendMessage(message);

        return response;

    }

}