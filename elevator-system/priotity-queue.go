package elevatorsystem

type PriorityQueue struct {
	items     []Request
	direction Direction
	currFloor int
}

func (pq PriorityQueue) Len() int { return len(pq.items) }

func (pq PriorityQueue) Less(i, j int) bool {
	// If going up, prioritize requests above current floor
	if pq.direction == UP {
		if pq.items[i].DestinationFloor >= pq.currFloor &&
			pq.items[j].DestinationFloor >= pq.currFloor {
			return pq.items[i].DestinationFloor < pq.items[j].DestinationFloor
		}
		return pq.items[i].DestinationFloor >= pq.currFloor
	}
	// If going down, prioritize requests below current floor
	if pq.direction == DOWN {
		if pq.items[i].DestinationFloor <= pq.currFloor &&
			pq.items[j].DestinationFloor <= pq.currFloor {
			return pq.items[i].DestinationFloor > pq.items[j].DestinationFloor
		}
		return pq.items[i].DestinationFloor <= pq.currFloor
	}
	// If idle, serve based on shortest distance
	return abs(pq.items[i].DestinationFloor-pq.currFloor) <
		abs(pq.items[j].DestinationFloor-pq.currFloor)
}

func (pq PriorityQueue) Swap(i, j int) {
	pq.items[i], pq.items[j] = pq.items[j], pq.items[i]
}

func (pq *PriorityQueue) Push(x interface{}) {
	pq.items = append(pq.items, x.(Request))
}

func (pq *PriorityQueue) Pop() interface{} {
	old := pq.items
	n := len(old)
	item := old[n-1]
	pq.items = old[0 : n-1]
	return item
}
