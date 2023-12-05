package main

import (
	"fmt"
	"os"
	"slices"
	"strconv"
	"strings"
)

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

  sum := 0

  for _, line := range input {
    fmt.Println(line)

    card := strings.Split(line, ":")
    numbers := strings.Split(card[1], "|")

    var win []int
    for _, w := range strings.Split(strings.Trim(numbers[0], " "), " ") {
      if len(w) < 1 { continue }
      n, err := strconv.Atoi(w)
      if err != nil { panic(err) }
      win = append(win, n)
    }

    var have []int
    for _, w := range strings.Split(strings.Trim(numbers[1], " "), " ") {
      if len(w) < 1 { continue }
      n, err := strconv.Atoi(w)
      if err != nil { panic(err) }
      have = append(have, n)
    }

    score := 0
    for _, n := range have {
      if slices.Contains(win, n) {
        if score == 0 {
          score = 1
        } else {
          score *= 2
        }
      }
    }

    sum += score
  }

  fmt.Println(sum)
}
