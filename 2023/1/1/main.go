package main

import (
	"fmt"
	"os"
	"strings"
)

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

    for _, ch := range line {
      if ch >= '0' && ch <= '9' {
        if first < 0 { first = int(ch - '0') }
        last = int(ch - '0')
      }
    }

    sum += first * 10 + last
    fmt.Print(fmt.Sprintf("%d %d %d\n", sum, first, last))
  }

  fmt.Print(fmt.Sprintf("%d\n", sum))
}
