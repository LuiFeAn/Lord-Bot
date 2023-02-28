import { Client, LocalAuth } from "whatsapp-web.js";

export const whatsProvider = new Client({
    authStrategy: new LocalAuth()
});

