package pubsubsystem

import "fmt"

type SubscriberState string

const (
	Hot  SubscriberState = "hot"
	Cold SubscriberState = "cold"
)

type Subscriber struct {
	Name  string
	State SubscriberState
}

func NewSubscriber(name string, state SubscriberState) *Subscriber {
	return &Subscriber{Name: name, State: state}
}

func (s *Subscriber) OnMessage(message *Message) {
	fmt.Printf("Subscriber %s recieved message: %s\n", s.Name, message.Content)
}
