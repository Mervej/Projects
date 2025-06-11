package elevatorsystem

import (
	"container/heap"
	"fmt"
	"time"
)

type Direction int
type ElevatorState int

const (
	UP Direction = iota
	DOWN
	NONE
)

const (
	IDLE ElevatorState = iota
	MOVING
	STOPPED
)

type Request struct {
	SourceFloor      int
	DestinationFloor int
	Direction        Direction
	IsInternal       bool
	TimeStamp        int64
}

type Elevator struct {
	Id           int
	CurrFloor    int
	MaxFloor     int
	MinFloor     int
	State        ElevatorState
	Direction    Direction
	RequestQueue *PriorityQueue
	Capacity     int
	CurrentLoad  int
}

func NewElevator(id, minFloor, maxFloor, capacity int) *Elevator {
	pq := &PriorityQueue{
		items:     make([]Request, 0),
		direction: NONE,
		currFloor: 0,
	}
	heap.Init(pq)

	return &Elevator{
		Id:           id,
		CurrFloor:    0,
		MaxFloor:     maxFloor,
		MinFloor:     minFloor,
		State:        IDLE,
		Direction:    NONE,
		RequestQueue: pq,
		Capacity:     capacity,
		CurrentLoad:  0,
	}
}

func (e *Elevator) AddRequest(req Request) error {
	if req.DestinationFloor > e.MaxFloor || req.DestinationFloor < e.MinFloor {
		return fmt.Errorf("invalid floor number")
	}

	req.TimeStamp = time.Now().Unix()
	heap.Push(e.RequestQueue, req)

	if e.State == IDLE {
		e.Direction = e.determineDirection(req)
		e.State = MOVING
	}
	return nil
}

func (e *Elevator) Step() {
	if e.RequestQueue.Len() == 0 {
		e.State = IDLE
		e.Direction = NONE
		return
	}

	next := heap.Pop(e.RequestQueue).(Request)

	if e.CurrFloor < next.DestinationFloor {
		e.CurrFloor++
		e.State = MOVING
		e.Direction = UP
	} else if e.CurrFloor > next.DestinationFloor {
		e.CurrFloor--
		e.State = MOVING
		e.Direction = DOWN
	} else {
		e.State = STOPPED
		e.processFloor()
		if e.RequestQueue.Len() > 0 {
			e.Direction = e.determineDirection(e.RequestQueue.items[0])
		} else {
			e.Direction = NONE
		}
	}
}

func (e *Elevator) determineDirection(req Request) Direction {
	if req.DestinationFloor > e.CurrFloor {
		return UP
	}
	if req.DestinationFloor < e.CurrFloor {
		return DOWN
	}
	return NONE
}

func (e *Elevator) processFloor() {
	fmt.Printf("Elevator %d stopped at floor %d\n", e.Id, e.CurrFloor)
	// Simulate door operations
	time.Sleep(time.Second)
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
