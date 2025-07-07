package models

type ColumnType int
type IndexType int

const (
	STR ColumnType = iota
	INT
	DATE
)

const (
	UNIQUE IndexType = 1
	STANDARD
)

type IndexMap map[interface{}]

type Row struct {
	Id     int
	Values map[string]interface{}
}

type Table struct {
	Name     string
	Columns  *[]Column
	RowCount int
	Data     map[int]Row
}

type Column struct {
	Name     string
	Required bool
	Col_type ColumnType
	Index
}
