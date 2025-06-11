package parkingsystem

import (
	"errors"
	"fmt"
	"time"
)

func (lot *ParkingLot) AddVehicle(vehicle *Vehicle) (*Ticket, error) {
	lot.Mutex.Lock()
	defer lot.Mutex.Unlock()

	// check free slot arr
	if len(lot.FreeSlotArr) == 0 {
		fmt.Printf("no free slots available!\n")
		return nil, errors.New("no free slots available!")
	}

	// create the ticket and add the slot from free to used arr
	for _, slotData := range lot.FreeSlotArr {
		if slotData.Type == vehicle.Type {
			delete(lot.FreeSlotArr, slotData.Id)

			ticket := &Ticket{
				Id:     len(lot.Tickets) + 1,
				Intime: time.Now(),
				Slot:   slotData,
			}
			lot.UsedSlotArr[slotData.Id] = slotData
			lot.Tickets[ticket.Id] = ticket
			fmt.Printf("Vehicle added: Type=%s, Slot=%d, Ticket=%d \n", vehicle.Type, slotData.Id, ticket.Id)
			return ticket, nil
		}
	}

	fmt.Printf("no free slots available for this vehicle!\n")
	return nil, errors.New("no free slots available for this vehicle!")
}

func (lot *ParkingLot) RemoveVehicle(ticket *Ticket) (float64, error) {

	lot.Mutex.Lock()
	defer lot.Mutex.Unlock()

	_, exsits := lot.Tickets[ticket.Id]

	if !exsits {
		fmt.Println("No such ticket found\n")
		return 0.0, errors.New("No such ticket found\n")
	}

	// calculate the amount
	duration := time.Now().Sub(ticket.Intime)
	amount := duration.Seconds() * (lot.HourRate / 3600)

	// remove the slot from the used slot list and add to free slot list
	delete(lot.UsedSlotArr, ticket.Slot.Id)
	lot.FreeSlotArr[ticket.Slot.Id] = ticket.Slot

	fmt.Printf("Vehicle removed: Type=%s, Slot=%d, Ticket=%d\n", ticket.Slot.Id, ticket.Id, amount)

	return amount, nil
}
