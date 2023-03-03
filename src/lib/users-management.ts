import { IUser } from "../interfaces/user-magagment"

class UsersManager {

    private users: IUser [];

    constructor(){

        this.users = [];

    }

    addUser(user: IUser){

        this.users.push(user);

    }

    getUser(number: string){

        const user = this.users.find( user => user.number === number);

        return user;

    }

    getAllUsers(){

        return this.users;

    }

}

export default UsersManager