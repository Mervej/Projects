package elevatorsystem

import (
	"fmt"
	"time"
)

func main() {
	e := NewElevator(1, 0, 10, 10)

	// Add some test requests
	requests := []Request{
		{SourceFloor: 0, DestinationFloor: 5, Direction: UP},
		{SourceFloor: 2, DestinationFloor: 8, Direction: UP},
		{SourceFloor: 6, DestinationFloor: 3, Direction: DOWN},
	}

	for _, req := range requests {
		e.AddRequest(req)
	}

	// Simulate elevator movement
	for i := 0; i < 15; i++ {
		fmt.Printf("\nStep %d: Floor %d, State: %v, Direction: %v\n",
			i+1, e.CurrFloor, e.State, e.Direction)
		e.Step()
		time.Sleep(time.Second)
	}
}
