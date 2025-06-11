package pubsubsystem

import (
	"sync"
)

type Topic struct {
	Name        string
	Subscribers map[Subscriber]struct{}
	Messages    []*Message
	mu          sync.RWMutex
}

func NewTopic(name string) *Topic {
	return &Topic{
		Name:        name,
		Subscribers: make(map[Subscriber]struct{}),
		Messages:    []*Message{},
	}
}

func (t *Topic) AddSubscriber(sub Subscriber) {
	t.mu.Lock()
	defer t.mu.Unlock()

	t.Subscribers[sub] = struct{}{}
	if sub.State == Cold {
		for _, message := range t.Messages {
			sub.OnMessage(message)
		}
	}
}

func (t *Topic) RemoveSubscriber(sub Subscriber) {
	t.mu.Lock()
	defer t.mu.Unlock()

	delete(t.Subscribers, sub)
}

func (t *Topic) PublishMsg(message *Message) {
	t.mu.Lock()
	defer t.mu.Unlock()

	t.Messages = append(t.Messages, message)
	for subscriber := range t.Subscribers {
		// subscribe to the message
		subscriber.OnMessage(message)
	}
}
