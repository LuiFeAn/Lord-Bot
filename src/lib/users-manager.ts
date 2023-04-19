import { IUser } from "../interfaces/user-magagment.js"

class UsersManager {

    private users: IUser [];

    constructor(){

        this.users = [];

    }

    /** Add an User to memory */
    addUser(user: IUser){

        this.users.push(user);

    }

    /** Get an User */
    getUser(number: string){

        const user = this.users.find( user => user?.number === number);

        return user;

    }

    /** Get all users connecteds on BOT */
    get allUsers(){

        return this.users;

    }

}

export default UsersManager
