package main

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

type step struct {
  cmd string
  length int
  color string
}

var plan [][]byte

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  input := strings.Split(string(data), "\n")

  parser := regexp.MustCompile(`(\w) (\d+) \((\#\w+)\)`)

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

  var steps []step
  x := 0
  y := 0
  minX := 0
  minY := 0
  maxX := 0
  maxY := 0

  for {
    line, _ := getLine()
    if len(line) <= 0 { break }

    res := parser.FindAllStringSubmatch(line, -1)[0]
    length, err := strconv.Atoi(res[2])
    if err != nil { panic(err) }
    s := step{
      cmd: res[1],
      length: length,
      color: res[3],
    }
    steps = append(steps, s)

    switch s.cmd {
    case "U":
      y -= s.length
    case "D":
      y += s.length
    case "L":
      x -= s.length
    case "R":
      x += s.length
    default:
      panic("Wrong cmd")
    }

    minX = min(minX, x)
    maxX = max(maxX, x)

    minY = min(minY, y)
    maxY = max(maxY, y)
  }

  fmt.Println(maxY-minY+1, maxX-minX+1)
  plan = make([][]byte, maxY-minY+1)
  for y := range plan {
    plan[y] = make([]byte, maxX-minX+1)
    for x := 0; x < len(plan[y]); x++ {
      plan[y][x] = '.'
    }
  }

  x = 0
  y = 0
  for _, s := range steps {
    for i := 0; i < s.length; i++ {
      plan[y-minY][x-minX] = '#'

      switch s.cmd {
      case "U":
        y--
      case "D":
        y++
      case "L":
        x--
      case "R":
        x++
      default:
        panic("Wrong cmd")
      }
    }
  }

  paint(-minX+1, -minY+1)

  sum := 0
  for _, line := range plan {
    fmt.Println(string(line))
    for x := 0; x < len(line); x++ {
      if line[x] == '#' { sum++ }
    }
  }
  fmt.Println(sum)
}

func paint(x, y int) {
  if plan[y][x] == '#' { return }

  plan[y][x] = '#'
  paint(x, y-1)
  paint(x, y+1)

  for i := x+1; i < len(plan[y]); i++ {
    if plan[y][i] == '.' {
      plan[y][i] = '#'
      paint(i, y-1)
      paint(i, y+1)
    } else {
      break
    }
  }

  for i := x-1; i >= 0; i-- {
    if plan[y][i] == '.' {
      plan[y][i] = '#'
      paint(i, y-1)
      paint(i, y+1)
    } else {
      break
    }
  }
}
