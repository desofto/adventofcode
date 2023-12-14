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

  var results []int

  for round := 0; round < 500; round++ {
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

    for {
      changed := false

      for y := 0; y < len(input); y++ {
        for x := len(input[y])-1; x > 0 ; x-- {
          if input[y][x] == 'O' && input[y][x-1] == '.' {
            input[y][x-1] = 'O'
            input[y][x] = '.'
            changed = true
          }
        }
      }

      if !changed { break }
    }

    for {
      changed := false

      for y := 0; y < len(input)-1; y++ {
        for x := 0; x < len(input[y]); x++ {
          if input[y][x] == 'O' && input[y+1][x] == '.' {
            input[y+1][x] = 'O'
            input[y][x] = '.'
            changed = true
          }
        }
      }

      if !changed { break }
    }

    for {
      changed := false

      for y := 0; y < len(input); y++ {
        for x := 0; x < len(input[y])-1 ; x++ {
          if input[y][x] == 'O' && input[y][x+1] == '.' {
            input[y][x+1] = 'O'
            input[y][x] = '.'
            changed = true
          }
        }
      }

      if !changed { break }
    }

    sum := 0

    for y, line := range input {
      // fmt.Println(string(line))
      for x := 0; x < len(line); x++ {
        if line[x] == 'O' {
          sum += len(input) - y
        }
      }
    }

    results = append(results, sum)

    f, l := findCycle(results)
    if f > 0 && l > 0 {
      index := f + (1_000_000_000 - f) % l - 1
      fmt.Println(f, l, index, results[index])
    }
  }
  // index := 2 + (1_000_000_000 - 2) % 7
  // fmt.Println(index, results[index])
  // fmt.Println(2 + (1_000_000_000 % 7))
}

// 81 72

// < 99147

func findCycle(results []int) (int, int) {
  for l := 1; l < len(results) / 2; l++ {
    found := true
    for i := 0; i < l; i++ {
      if results[len(results)-1-i] != results[len(results)-1-l-i] {
        found = false
        break
      }
    }
    if found {
      return len(results)-1-l-l, l
    }
  }
  return 0,0
}
