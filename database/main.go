package main

import (
	"database/models"
	service "database/services"
	"fmt"
)

func main() {

	columns1 := models.Column{
		Name:     "name",
		Col_type: models.STR,
		Required: true,
	}
	column2 := models.Column{
		Name:     "nums",
		Col_type: models.INT,
		Required: false,
	}

	columns := []models.Column{columns1, column2}

	table1 := service.NewTable("table1", columns)

	row1 := models.Row{
		Values: map[string]interface{}{
			"name": "Mervej",
			"nums": 1,
		},
	}
	rowData, err := (table1.InsertRow(row1))
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(rowData)

}
