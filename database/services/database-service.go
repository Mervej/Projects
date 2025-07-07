package service

import (
	"database/models"
	"errors"
	"fmt"
	"reflect"
	"time"
)

type TableService struct {
	table *models.Table
}

func NewTable(name string, columns []models.Column) *TableService {

	table := &models.Table{
		Name:     name,
		Columns:  &columns,
		RowCount: 0,
		Data:     make(map[int]models.Row),
	}

	return &TableService{table}
}

func (t *TableService) InsertRow(rowData models.Row) (models.Row, error) {
	t.table.RowCount = t.table.RowCount + 1
	rowId := t.table.RowCount

	for _, tableColumn := range *t.table.Columns {
		value, exists := rowData.Values[tableColumn.Name]
		// Validations for required columns
		fmt.Println(tableColumn.Name, exists)
		if tableColumn.Required && (!exists || value == nil) {
			return models.Row{}, errors.New("req column missing")
		}

		// validations for type checks
		if exists && (tableColumn.Col_type == models.STR && reflect.TypeOf(value) != reflect.TypeOf("test")) ||
			(tableColumn.Col_type == models.INT && reflect.TypeOf(value) != reflect.TypeOf(1)) ||
			(tableColumn.Col_type == models.DATE && reflect.TypeOf(value) != reflect.TypeOf(time.Now())) {
			return models.Row{}, errors.New("column type mismatch")
		}
	}

	// check in the row key exists in the column mapping for the table
	for key := range rowData.Values {
		found := false
		for _, tableColumn := range *t.table.Columns {
			if key == tableColumn.Name {
				found = true
				break
			}
		}
		if !found {
			return models.Row{}, fmt.Errorf("column %s does not exist in table", key)
		}
	}

	rowData.Id = rowId
	t.table.Data[rowId] = rowData

	return t.table.Data[rowId], nil
}
