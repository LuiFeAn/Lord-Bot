import LordBot from "./lib/bot";

import env from 'dotenv';

import UsersManager from "./lib/users-manager";

env.config();

const bot = new LordBot({
    name: process.env.LORD_BOT_NAME as string,
    owner:{
        number: process.env.OWNER_NUMBER as string,
        state: process.env.OWNER_INITIAL_STATE as string,
    },
    multiplyUsers: new UsersManager()
});

bot.initialize();

bot.onState([
    {
        name:'initial',
        execute({ user }) {

            user.stateChanger('twonitial');

        },
    },
    {
        name:'twonitial',
        execute({ user }) {

            console.log('Foi pro segundo');

        },
    }
]);

bot.onAnyState({
    name:'optional',
    execute({ user }) {

        console.log('executou');

    },
})
