import { users } from "../mock/database/user"

export const userRepository = {

    createUser( number: string, state: string ){

        users.push({
            number,
            state
        });

    },

    findUserFromNumber(number: string){

        const user = users.find( user => user.number === number);

        return user;

    }

}