import gtts from 'gtts'
import Whatsapp from 'whatsapp-web.js';
import fs from 'fs';

export default class Audio {

    generate(text: string, leng: string): Promise<Whatsapp.MessageContent> {

        return new Promise((resolve,reject) => {

            const randomNumber = Math.floor(Math.random() * 2000);

            const fileName = `audio-${randomNumber}.mp3`;    
            
            const Gtts = new gtts(text,leng);

            Gtts.save(fileName,function(err:any,result:any){

                if(err) return reject('Error');

                const media = Whatsapp.MessageMedia.fromFilePath(fileName);

                fs.unlink(fileName, ( error: any ) => null);

                resolve(media);


            });

        })

    }

    
}