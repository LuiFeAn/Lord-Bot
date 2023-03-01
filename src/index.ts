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

let selectedCustomMessage: string = '';

bot.stateCreator([
    {
        name:'initial',
        async execute(owner){

            const { number } = owner;

            await bot.say(number,`Olá ! me chamo ${bot.name} e meu trabalho é avisar a todos que você está em live no momento!`)

            bot.say(number,'Primeiramente, qual mensagem personalizada você gostaria de manter ?');

            bot.stateChanger('customMessage')

        }
    },
    {
        name:'command',
        execute(owner) {

            console.log('executou')

        },
    },
    {
        name:'customMessage',
        async execute(owner) {

            const { number, message } = owner;

            await bot.say(number,`Ótimo ! então a mensagem será "${message}"`);

            selectedCustomMessage = message!;

        },
    },
    {
        name:'sendMessage',
        execute(owner) {

            const { contacts } = owner;

            contacts?.forEach( contact => {


            })

        },
    }
])

