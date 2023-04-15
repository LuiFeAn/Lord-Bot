import { unofficialGpt } from "../providers/chatgpt-provider.js";
import dotenv from 'dotenv';

dotenv.config();

export default {

    sendQuestion(message: string){

        if( !process.env.OPENAI_ACESS_TOKEN ){

            return 'No access token set so I can connect to OpenAI services'

        }

        const response = unofficialGpt.sendMessage(message);

        return response;

    }

}