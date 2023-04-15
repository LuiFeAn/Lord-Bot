import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from "chatgpt";

import dotenv from 'dotenv';

dotenv.config();

const officialGpt = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY as string  || '.....#####.....'
});

const unofficialGpt = new ChatGPTUnofficialProxyAPI({
    accessToken: process.env.OPENAI_ACESS_TOKEN as string || '.....#####.....'
});

export {
    officialGpt,
    unofficialGpt
}