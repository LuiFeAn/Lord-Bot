import { officialGpt } from "../providers/chatgpt-provider.js";


export default {

    sendQuestion(message: string){

        const response = officialGpt.sendMessage(message);

        return response;

    }

}