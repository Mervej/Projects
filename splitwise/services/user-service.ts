import { IUser } from './../models';

export class UserService {
    private users: Map<number, IUser> = new Map();
    private count: number = 0;

    createUser(name: string, email: string): IUser {
        const id = this.count++;
        const user: IUser = { id, name, email };
        this.users.set(id, user);
        return user;
    }

    getUser(id: number): IUser | Error {
        const user = this.users.get(id);
        if (!user) {
            return new Error('User not found');
        }
        return user;
    }
}