package main

import (
	"fmt"
	"os"
	"strings"
)

var digits = [...]string{ "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" }

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil {
    panic(err)
  }
  lines := strings.Split(string(data), "\n")

  sum := 0

  for _, line := range lines {
    if len(line) <= 0 { break }
    fmt.Print(line + "\n")

    first := -1
    last := -1

    for index, ch := range line {
      if ch >= '0' && ch <= '9' {
        if first < 0 { first = int(ch - '0') }
        last = int(ch - '0')
      }

      for n, digit := range digits {
        if strings.Index(line[index:], digit) == 0 {
          if first < 0 { first = n+1 }
          last = n+1
        }
      }

    }

    sum += first * 10 + last
    fmt.Print(fmt.Sprintf("%d %d %d\n", sum, first, last))
  }

  fmt.Print(fmt.Sprintf("%d\n", sum))
}
