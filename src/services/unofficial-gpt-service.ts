import { unofficialGpt } from "../providers/chatgpt-provider.js";

export default {

    sendQuestion(message: string){

        const response = unofficialGpt.sendMessage(message);

        return response;

    }

}