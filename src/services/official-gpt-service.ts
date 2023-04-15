import { officialGpt } from "../providers/chatgpt-provider.js";
import dotenv from 'dotenv';

dotenv.config();


export default {

    sendQuestion(message: string){

        if( !process.env.OPENAI_API_KEY ){

            return 'No key has been defined so that I can connect to the OpenAI API'

        }

        const response = officialGpt.sendMessage(message);

        return response;

    }

}