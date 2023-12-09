package main

import (
	"fmt"
	"os"
	"regexp"
	"strings"
)

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  input := strings.Split(string(data), "\n")

  getLine := func () (string, bool) {
    var line string

    if len(input) <= 0 {
      return "", true
    }

    line = strings.Trim(input[0], " ")
    input = input[1:]

    end := len(input) <= 0 || len(strings.Trim(input[0], " ")) <= 0

    if end {
      input = input[1:]
    }

    return line, end
  }

  type step struct {
    L string
    R string
  }

  var instructions string
  var connections map[string]step = make(map[string]step)

  instructions, _ = getLine()

  parser := regexp.MustCompile(`(\w+) = \((\w+), (\w+)\)`)

  for {
    line, _ := getLine()
    if len(line) <= 0 { break }

    res := parser.FindAllStringSubmatch(line, -1)[0]
    connections[res[1]] = step{
      L: res[2],
      R: res[3],
    }
  }

  type typeState struct {
    cell string
    steps int
    period int
  }

  index := 0
  var state []*typeState

  for name := range connections {
    if name[2] == 'A' {
      state = append(state, &typeState{
        cell: name,
        steps: 0,
        period: 0,
      })
    }
  }

  for {
    step := instructions[index]
    index++
    if index >= len(instructions) { index = 0 }

    finished := true
    for _, s := range state {
      if step == 'L' { s.cell = connections[s.cell].L }
      if step == 'R' { s.cell = connections[s.cell].R }

      s.steps++

      if s.cell[2] == 'Z' {
        s.period = s.steps
        s.steps = 0
      } else if s.period == 0 {
        finished = false
      }
    }

    if finished { break }
  }

  periods := make([]int, len(state))
  for i, s := range state {
    periods[i] = s.period
  }

  // 12643 19099 16409 15871 18023 21251
  // 269
  // 47 71 61 59 67 79
  // 17099847107071

  mul := periods[0]
  for {
    found := true
    for _, period := range periods {
      if period % mul != 0 {
        found = false
        break
      }
    }

    if found { break }

    mul--
  }

  steps := mul
  for _, period := range periods {
    steps *= period / mul
  }

  fmt.Println(mul, periods, steps)
}
