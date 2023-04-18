import LordBot from "./lib/bot.js";
import dotenv from 'dotenv';

dotenv.config();

const bot = new LordBot({
    name:'Shazam',
    owner:{
        number:process.env.OWNER_NUMBER as string
    },
    multiplyUsers:true
});

bot.initialize();

bot.onState([
    {
        name:'initial',
        execute({ user }) {
            
            bot.sendAudio(true);

        },
    }
]);


bot.onAnyState({
    name:'a',
    execute({ user }) {
        
    },
})