import LordBot from "./lib/bot.js";

import env from 'dotenv';

env.config();

const bot = new LordBot({
    name: process.env.LORD_BOT_NAME as string,
    owner:{
        number: process.env.OWNER_NUMBER as string,
    },
});

bot.initialize();

bot.onState([
    {
        name:'initial',
        async execute({ user, owner }) {

           await bot.say(user.number,'Faça uma pergunta !');

           user.stateChanger('gpt');

        },
    },
    {
        name:'gpt',
        async execute({ user, owner }) {
            
           const response = await bot.gpt(user.message,{type:'official'});

           bot.say(user.number,response);

        },
    }
]);

bot.onAnyState({
    name:'optional',
    execute({ user }) {

        if( user.message[0] === '/'){



        }

    },
})
