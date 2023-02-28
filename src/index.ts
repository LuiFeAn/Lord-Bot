import LordBot from "./lib/bot";

const bot = new LordBot({

    name:'Shazam',
    owner:{
        number:'559196319494@c.us',
        state:'initial'
    },
    states:[
        {
            name:'initial',
            execute(){
                console.log('teste')
            }

        }
    ]
    
});

bot.initialize();


