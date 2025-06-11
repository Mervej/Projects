package parkingsystem

func Parkingsystem() {
	lot := NewParkingLot(120)

	slot1 := &ParkingSlot{
		Id:       1,
		Type:     Bike,
		Occupied: false,
	}
	slot2 := &ParkingSlot{
		Id:       2,
		Type:     Car,
		Occupied: false,
	}
	slot3 := &ParkingSlot{
		Id:       3,
		Type:     Truck,
		Occupied: false,
	}

	lot.FreeSlotArr[slot1.Id] = slot1
	lot.FreeSlotArr[slot2.Id] = slot2
	lot.FreeSlotArr[slot3.Id] = slot3

	vehicle1 := &Vehicle{
		Id:   1,
		Type: Bike,
	}

	vehicle2 := &Vehicle{
		Id:   2,
		Type: Car,
	}

	vehicle3 := &Vehicle{
		Id:   3,
		Type: Truck,
	}

	vehicle4 := &Vehicle{
		Id:   4,
		Type: Car,
	}

	lot.AddVehicle(vehicle1)
	t1, _ := lot.AddVehicle(vehicle2)
	lot.AddVehicle(vehicle3)
	lot.AddVehicle(vehicle4)

	lot.RemoveVehicle(t1)
	lot.AddVehicle(vehicle4)

}
