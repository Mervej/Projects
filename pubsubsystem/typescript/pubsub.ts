import { Topic } from '../topic';
import { Subscriber, SubscriberState } from './subscriber';
import { Publisher } from './publisher';
import { Message } from './message';

export function pubsub(): void {
    // create topics
    const topic1 = Topic.newTopic("topic 1");
    const topic2 = Topic.newTopic("topic 2");

    // create subscribers
    const subs1 = Subscriber.newSubscriber("subs 1", SubscriberState.Hot);
    const subs2 = Subscriber.newSubscriber("subs 2", SubscriberState.Cold);

    // create publishers
    const pub1 = Publisher.newPublisher();
    const pub2 = Publisher.newPublisher();

    // add subscribers to the topic
    topic1.addSubscriber(subs1);
    topic2.addSubscriber(subs2);

    // register topic to publishers
    pub1.registerTopic(topic1);
    pub2.registerTopic(topic2);

    // now add msg to topic
    pub1.publish(topic1, Message.newMessage("test msg 1"));
    pub2.publish(topic2, Message.newMessage("test msg 2"));

    const subs3 = Subscriber.newSubscriber("subs 3", SubscriberState.Cold);
    topic2.addSubscriber(subs3);

    pub2.publish(topic1, Message.newMessage("test msg 3"));
}