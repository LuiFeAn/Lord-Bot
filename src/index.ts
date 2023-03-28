import LordBot from "./lib/bot";

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
        execute({ user, owner }) {

           console.log('Está no primeiro');

        },
    },
    {
        name:'twonitial',
        execute({ user }) {

            console.log('Chegou no segundo');

        },
    }
]);

bot.onAnyState({
    name:'optional',
    execute({ user }) {

        console.log('Executou');

    },
})
