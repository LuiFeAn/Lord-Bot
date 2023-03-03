import LordBot from "./lib/bot";

import env from 'dotenv';
import BotError from "./errors/bot-err";
import UsersManager from "./lib/users-management";

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

let customMessage = '';

bot.stateCreator([
    {
        name:'commands',
        forAnyState: true,
        async execute(owner) {

            const valid = [ '/mudar mensagem personalizada', '/enviar mensagem personalizada para meus contatos' ];

            if( owner.message![0] === '/' ){

                if( !valid.includes( owner.message! )){

                    throw new BotError({
                        to: owner.number,
                        message:'Opção não existente'
                    })

                }

                switch( owner.message! ){

                    case '/mudar mensagem personalizada':

                        bot.stateChanger('customMessageChange');

                    break;

                    case '/enviar mensagem personalizada para meus contatos':

                        if( !customMessage ){

                            return await bot.say(owner.number,'Você não defeniu nenhuma mensagem personalizada ainda');

                        }

                        await bot.say(owner.number,'Ok ! estou enviando');

                        owner.contacts?.forEach( async contact => {

                            const { number } = contact;

                            await bot.say(number,customMessage);

                        })

                    break;


                }

            }

        },
    },
    {
        name:'initial',
        async execute(owner) {

            await bot.say(owner.number,`Olá ! me chamo ${bot.name}. Sou um BOT que que compartilha que você está em live com todos os seus contatos do WhatsApp`);

            await bot.say(owner.number,'Qual mensagem personalizada você gostaria de enviar aos seus contatos ?');

            bot.stateChanger('customMessage');


        }
    },
    {
        name:'customMessage',
        async execute(owner) {

            await bot.say(owner.number,`Ótimo ! então a mensagem personalizada será "${owner.message}"`);

            await bot.say(owner.number,'Caso você queira mudar a sua mensagem personalizada posteriormente, basta executar o comando "/mudar mensagem personalizada"');

            await bot.say(owner.number,'Caso você queira enviar sua mensagem, digite o comando /enviar mensagem personalizada para meus contatos para que eu possa a enviar');

            customMessage = owner.message!;

            bot.stateChanger('nextStep');

        },
    },
    {
        name:'nextStep',
        async execute(owner) {

            bot.stateChanger('null');

        },
    },
    {
        name:'customMessageChange',
        async execute(owner) {

            await bot.say(owner.number,'Para qual mensagem você gostaria de alterar ?');

            bot.stateChanger('customMessageChangeValue');

        },
    },
    {
        name:'customMessageChangeValue',
        async execute(owner) {

            await bot.say(owner.number,`Certo ! a mensagem customizada foi alterada para "${owner.message}"`);

            customMessage = owner.message!;

            bot.stateChanger('nextStep')

        },
    }
])
