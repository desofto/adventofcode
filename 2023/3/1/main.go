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

func isSymbol(ch byte) bool {
  return !isNumber(ch) && ch != '.'
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

  for y, line := range input {
    fmt.Println(line)

    number := ""
    consider := false
    for x, c := range line {
      if isNumber(byte(c)) {
        number = number + string(c)
        if isSymbol(ch(x-1, y-1)) { consider = true }
        if isSymbol(ch(  x, y-1)) { consider = true }
        if isSymbol(ch(x+1, y-1)) { consider = true }
        if isSymbol(ch(x-1,   y)) { consider = true }
        if isSymbol(ch(x+1,   y)) { consider = true }
        if isSymbol(ch(x-1, y+1)) { consider = true }
        if isSymbol(ch(  x, y+1)) { consider = true }
        if isSymbol(ch(x+1, y+1)) { consider = true }
      } else {
        if consider && len(number) > 0 {
          num, err := strconv.Atoi(number)
          if err != nil { panic(err) }
          fmt.Println(fmt.Sprintf("%s %d", number, num))
          sum += num
          fmt.Println(sum)
        }
        number = ""
        consider = false
      }
    }
    if consider && len(number) > 0 {
      num, err := strconv.Atoi(number)
      if err != nil { panic(err) }
      fmt.Println(fmt.Sprintf("%s %d", number, num))
      sum += num
      fmt.Println(sum)
    }
  }

  fmt.Println(sum)
}
// 538237
