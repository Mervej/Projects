package parkingsystem

import (
	"sync"
	"time"
)

type VehicleType int

const (
	Bike VehicleType = iota
	Car
	Truck
)

type Vehicle struct {
	Id   int
	Type VehicleType
}

type Ticket struct {
	Id      int
	Slot    *ParkingSlot
	Intime  time.Time
	Outtime time.Time
	Fee     float64
}

type ParkingSlot struct {
	Id       int
	Type     VehicleType
	Occupied bool
	Vehicle  *Vehicle
}

type ParkingLot struct {
	FreeSlotArr map[int]*ParkingSlot
	UsedSlotArr map[int]*ParkingSlot
	Tickets     map[int]*Ticket
	HourRate    float64
	Mutex       sync.Mutex
}

func NewParkingLot(rate float64) *ParkingLot {
	return &ParkingLot{
		FreeSlotArr: make(map[int]*ParkingSlot),
		UsedSlotArr: make(map[int]*ParkingSlot),
		Tickets:     make(map[int]*Ticket),
		HourRate:    rate,
	}
}
