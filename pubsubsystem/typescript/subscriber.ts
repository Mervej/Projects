import { Message } from './message';

export enum SubscriberState {
    Hot = 'hot',
    Cold = 'cold'
}

export class Subscriber {
    name: string;
    state: SubscriberState;

    constructor(name: string, state: SubscriberState) {
        this.name = name;
        this.state = state;
    }

    static newSubscriber(name: string, state: SubscriberState): Subscriber {
        return new Subscriber(name, state);
    }

    onMessage(message: Message): void {
        console.log(`Subscriber ${this.name} received message: ${message.content}`);
    }
}