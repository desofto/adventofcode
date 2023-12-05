package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func isNumber(ch byte) bool {
  return ch >= '0' && ch <= '9'
}

func isStar(ch byte) bool {
  return ch == '*'
}

type gear struct {
  x, y int
  parts []int
}

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  lines := strings.Split(string(data), "\n")

  var input []string
  for _, line := range lines {
    if len(line) > 0 {
      input = append(input, line)
    }
  }

  ch := func(x int, y int) byte {
    if y < 0 { return '.' }
    if y >= len(input) { return '.' }
    if x < 0 { return '.' }
    if x >= len(input[y]) { return '.' }
    return input[y][x]
  }

  sum := 0

  var gears []gear

  appendGear := func(x int, y int, number int) gear {
    for _, g := range gears {
      if g.x == x && g.y == y {
        g.parts = append(g.parts, number)
        return g
      }
    }

    g := gear{
      x: x,
      y: y,
      parts: []int{number},
    }

    gears = append(gears, g)

    return g
  }

  for y, line := range input {
    fmt.Println(line)

    number := ""
    consider := false
    starX := -1
    starY := -1
    for x, c := range line {
      if isNumber(byte(c)) {
        number = number + string(c)
        if isStar(ch(x-1, y-1)) { consider = true; starX = x-1; starY = y-1 }
        if isStar(ch(  x, y-1)) { consider = true; starX =   x; starY = y-1 }
        if isStar(ch(x+1, y-1)) { consider = true; starX = x+1; starY = y-1 }
        if isStar(ch(x-1,   y)) { consider = true; starX = x-1; starY =   y }
        if isStar(ch(x+1,   y)) { consider = true; starX = x+1; starY =   y }
        if isStar(ch(x-1, y+1)) { consider = true; starX = x-1; starY = y+1 }
        if isStar(ch(  x, y+1)) { consider = true; starX =   x; starY = y+1 }
        if isStar(ch(x+1, y+1)) { consider = true; starX = x+1; starY = y+1 }
      } else {
        if consider && len(number) > 0 {
          num, err := strconv.Atoi(number)
          if err != nil { panic(err) }
          g := appendGear(starX, starY, num)
          if len(g.parts) > 1 {
            ratio := g.parts[0] * g.parts[1]
            sum += ratio
          }
        }
        number = ""
        consider = false
      }
    }
    if consider && len(number) > 0 {
      num, err := strconv.Atoi(number)
      if err != nil { panic(err) }
      g := appendGear(starX, starY, num)
      if len(g.parts) > 1 {
        ratio := g.parts[0] * g.parts[1]
        sum += ratio
      }
    }
  }

  fmt.Println(sum)
}
