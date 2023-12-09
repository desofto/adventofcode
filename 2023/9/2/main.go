package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  input := strings.Split(string(data), "\n")

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

  sum := 0

  for {
    line, _ := getLine()
    if len(line) <= 0 { break }

    var history []int
    for _, value := range strings.Split(line, " ") {
      val, err := strconv.Atoi(strings.Trim(value, " "))
      if err != nil { panic(err) }

      history = append(history, val)
    }

    prevValue := predict(history)
    sum += prevValue
    fmt.Println(sum, history, prevValue)
    // break
  }

  fmt.Println(sum)
}

func predict(history []int) int {
  allZeroes := true
  for _, value := range history {
    if value != 0 {
      allZeroes = false
      break
    }
  }
  if allZeroes { return 0 }

  subsequence := make([]int, len(history)-1)
  for i := 0; i < len(history)-1; i++ {
    subsequence[i] = history[i+1] - history[i]
  }

  return history[0] - predict(subsequence)
}
