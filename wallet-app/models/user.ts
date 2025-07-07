export interface User {
    id: number;
    name: string;
    email: string;
}

export class UserService {
    private count: number = 0;
    private userMap: Map<number, User> = new Map();

    createUser(name: string, email: string): User {
        const user: User = {
            id: this.count++,
            name,
            email
        }

        this.userMap.set(user.id, user);

        return user;
    }

}