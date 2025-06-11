package keyboard

import (
	"fmt"
)

type Button struct {
	Label  string
	X      float64
	Y      float64
	Width  float64
	Height float64
}

type Keyboard struct {
	Buttons map[float64][]Button
}

func NewKeyboard(initX float64, initY float64) *Keyboard {
	fmt.Println(initX, initY)

	layout := [][]struct {
		Label  string
		Width  float64
		Height float64
	}{
		{{"`", 1, 1}, {"1", 1, 1}, {"2", 1, 1}, {"3", 1, 1}, {"4", 1, 1}, {"5", 1, 1}, {"6", 1, 1}, {"7", 1, 1}, {"8", 1, 1}, {"9", 1, 1}, {"0", 1, 1}, {"-", 1, 1}, {"=", 1, 1}, {"⌫", 2, 1}},
		{{"Tab", 1.5, 1}, {"Q", 1, 1}, {"W", 1, 1}, {"E", 1, 1}, {"R", 1, 1}, {"T", 1, 1}, {"Y", 1, 1}, {"U", 1, 1}, {"I", 1, 1}, {"O", 1, 1}, {"P", 1, 1}, {"[", 1, 1}, {"]", 1, 1}, {"\\", 1.5, 1}},
		{{"Caps", 1.75, 1}, {"A", 1, 1}, {"S", 1, 1}, {"D", 1, 1}, {"F", 1, 1}, {"G", 1, 1}, {"H", 1, 1}, {"J", 1, 1}, {"K", 1, 1}, {"L", 1, 1}, {";", 1, 1}, {"'", 1, 1}, {"Return", 2.25, 1}},
		{{"Shift", 2.25, 1}, {"Z", 1, 1}, {"X", 1, 1}, {"C", 1, 1}, {"V", 1, 1}, {"B", 1, 1}, {"N", 1, 1}, {"M", 1, 1}, {",", 1, 1}, {".", 1, 1}, {"/", 1, 1}, {"Shift", 2.75, 1}},
		{{"Ctl", 1, 1}, {"Opt", 1, 1}, {"Cmd", 1.25, 1}, {"Spacebar", 6.25, 1}, {"Cmd", 1.25, 1}, {"Opt", 1, 1}, {"", 1, 1}, {"↑", 1, 0.5}, {"", 1, 1}},
		{{"", 1, 1}, {"", 1, 1}, {"", 1, 1}, {"", 1, 1}, {"", 1, 1}, {"", 1, 1}, {"←", 1, 0.5}, {"↓", 1, 0.5}, {"→", 1, 0.5}},
	}

	buttons := make(map[float64][]Button)
	y := initY

	for _, row := range layout {
		x := initX
		rowButtons := []Button{}
		for _, key := range row {
			rowButtons = append(rowButtons, Button{
				Label:  key.Label,
				Height: key.Height,
				Width:  key.Width,
				X:      x,
				Y:      y,
			})
			x += key.Width
		}
		buttons[y] = rowButtons
		y++
	}

	return &Keyboard{Buttons: buttons}
}

func (k *Keyboard) PrintKey(x float64, y float64) bool {
	// check if the exsits in the
	for height, buttons := range k.Buttons {
		if height <= y && height+1 > y {
			for _, button := range buttons {
				if button.X >= x && button.X+button.Width > x {
					fmt.Printf("Button at 2(%f, %f): %s\n", x, y, button.Label)
					return true
				}
			}
		}
	}

	fmt.Printf("No button at (%f, %f): \n", x, y)
	return false
}
