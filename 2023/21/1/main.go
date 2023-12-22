package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  lines := strings.Split(string(data), "\n")

  var input [][]byte

  for _, line := range lines {
    if len(line) > 0 {
      input = append(input, []byte(line))
    }
  }

  for step := 1; step <= 64; step++ {
    newInput := make([][]byte, len(input))
    for y := range input {
      newInput[y] = make([]byte, len(input[y]))
      copy(newInput[y], input[y])
    }

    for y := 0; y < len(newInput); y++ {
      for x := 0; x < len(newInput[y]); x++ {
        if input[y][x] == 'S' || input[y][x] == 'O' {
          newInput[y][x] = '.'
          if y > 0 && newInput[y-1][x] == '.' { newInput[y-1][x] = 'O' }
          if x > 0 && newInput[y][x-1] == '.' { newInput[y][x-1] = 'O' }
          if x < len(newInput[y])-1 && newInput[y][x+1] == '.' { newInput[y][x+1] = 'O' }
          if y < len(newInput)-1 && newInput[y+1][x] == '.' { newInput[y+1][x] = 'O' }
        }
      }
    }

    for y := range newInput {
      input[y] = make([]byte, len(newInput[y]))
      copy(input[y], newInput[y])
    }
  }

  for _, line := range input {
    l := ""
    for _, el := range line {
      l += string(el)
    }
    fmt.Println(l)
  }

  count := 0
  for y := 0; y < len(input); y++ {
    for x := 0; x < len(input[y]); x++ {
      if input[y][x] == 'O' { count++ }
    }
  }
  fmt.Println(count)
}
