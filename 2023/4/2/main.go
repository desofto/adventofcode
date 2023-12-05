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

  var counts []int

  for index, line := range input {
    fmt.Println(line)

    if len(counts) < index+1 { counts = append(counts, 1) }

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
        score++
      }
    }

    for i := 1; i <= score; i++ {
      if len(counts) < index+i+1 { counts = append(counts, 1) }
      counts[index+i] += counts[index]
    }

    sum += counts[index]
    // fmt.Println(counts[index], score, sum, counts)
  }

  fmt.Println(sum)
}
