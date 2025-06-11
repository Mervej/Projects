import { Topic } from '../topic';
import { Message } from './message';

export class Publisher {
    topics: Map<Topic, boolean>;

    constructor() {
        this.topics = new Map<Topic, boolean>();
    }

    static newPublisher(): Publisher {
        return new Publisher();
    }

    registerTopic(topic: Topic): void {
        this.topics.set(topic, true);
    }

    publish(topic: Topic, message: Message): void {
        if (!this.topics.has(topic)) {
            console.log(`No such topic exists in the publisher: ${topic.name}`);
            return;
        }

        topic.publishMsg(message);
    }
}