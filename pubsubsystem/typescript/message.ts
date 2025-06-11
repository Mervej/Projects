export class Message {
    content: string;

    constructor(content: string) {
        this.content = content;
    }

    static newMessage(content: string): Message {
        return new Message(content);
    }
}