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

  for {
    changed := false

    for y := len(input)-1; y > 0; y-- {
      for x := 0; x < len(input[y]); x++ {
        if input[y][x] == 'O' && input[y-1][x] == '.' {
          input[y-1][x] = 'O'
          input[y][x] = '.'
          changed = true
        }
      }
    }

    if !changed { break }
  }

  sum := 0

  for y, line := range input {
    fmt.Println(string(line))
    for x := 0; x < len(line); x++ {
      if line[x] == 'O' {
        sum += len(input) - y
      }
    }
  }

  fmt.Println(sum)
}
