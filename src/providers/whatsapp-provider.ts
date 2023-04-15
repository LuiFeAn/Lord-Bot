import Whatsapp from 'whatsapp-web.js';

export const whatsProvider = new Whatsapp.Client({
    authStrategy: new Whatsapp.LocalAuth()
});

