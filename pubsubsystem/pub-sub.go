package pubsubsystem

func Pubsub() {
	// create topics
	topic1 := NewTopic("topic 1")
	topic2 := NewTopic("topic 2")

	// create subscribers
	subs1 := NewSubscriber("subs 1", Hot)
	subs2 := NewSubscriber("subs 2", Cold)

	// create publishers
	pub1 := NewPublisher()
	pub2 := NewPublisher()

	// add subscribers to the topic
	topic1.AddSubscriber(*subs1)
	topic2.AddSubscriber(*subs2)

	// register topic to publishers
	pub1.RegisterTopic(topic1)
	pub2.RegisterTopic(topic2)

	// now add msg to topic
	pub1.Publish(topic1, (NewMessage("test msg 1")))
	pub2.Publish(topic2, (NewMessage("test msg 2")))

	subs3 := NewSubscriber("subs 3", Cold)
	topic2.AddSubscriber(*subs3)

	pub2.Publish(topic1, (NewMessage("test msg 3")))

}
