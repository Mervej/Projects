import { Subscriber, SubscriberState } from './typescript/subscriber';
import { Message } from './typescript/message';

export class Topic {
    name: string;
    subscribers: Map<Subscriber, boolean>;
    messages: Message[];

    constructor(name: string) {
        this.name = name;
        this.subscribers = new Map<Subscriber, boolean>();
        this.messages = [];
    }

    static newTopic(name: string): Topic {
        return new Topic(name);
    }

    addSubscriber(sub: Subscriber): void {
        this.subscribers.set(sub, true);
        
        if (sub.state === SubscriberState.Cold) {
            for (const message of this.messages) {
                sub.onMessage(message);
            }
        }
    }

    removeSubscriber(sub: Subscriber): void {
        this.subscribers.delete(sub);
    }

    publishMsg(message: Message): void {
        this.messages.push(message);
        
        for (const subscriber of this.subscribers.keys()) {
            // subscribe to the message
            subscriber.onMessage(message);
        }
    }
}