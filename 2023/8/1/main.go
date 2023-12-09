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

  steps := 0
  index := 0
  cell := "AAA"
  for cell != "ZZZ" {
    step := instructions[index]
    index++
    if index >= len(instructions) { index = 0 }

    if step == 'L' { cell = connections[cell].L }
    if step == 'R' { cell = connections[cell].R }

    steps++
  }
  fmt.Println(steps)
}
