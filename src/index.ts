import LordBot from "./lib/bot";

import dotenv from 'dotenv';

dotenv.config();

const bot = new LordBot({

    name: process.env.LORD_BOT_NAME as string,
    owner:{
        number: process.env.OWNER_NUMBER as string,
        state: process.env.OWNER_INITIAL_STATE as string
    },
    
});

bot.initialize();

bot.stateCreator([
    {
        name:'initial',
        execute(owner){
            
            if( owner.message === 'teste'){

                bot.stateChanger('nex level');

            }

        }

    },
    {
        name:'nex level',
        execute(owner){

            bot.say(owner.number,'você foi para o nex level')

        }
    }
    
]);


