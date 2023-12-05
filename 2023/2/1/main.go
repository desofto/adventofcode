package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

var conditions = map[string]int{
  "red": 12,
  "green": 13,
  "blue": 14,
}

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

    consider := true

    game := strings.Split(line, ":")
    gameNo, err := strconv.Atoi(strings.Split(strings.Trim(game[0], " "), " ")[1])
    if err != nil { panic(fmt.Sprintf("Error during conversion %s", strings.Split(strings.Trim(game[0], " "), " ")[1])) }
    sets := strings.Split(strings.Trim(game[1], " "), ";")

    for _, set := range sets {
      pairs := strings.Split(strings.Trim(set, " "), ",")
      for _, pair := range pairs {
        p := strings.Split(strings.Trim(pair, " "), " ")

        count, err := strconv.Atoi(p[0])
        if err != nil { panic("Error during conversion") }

        color := p[1]

        if count > conditions[color] {
          consider = false
        }
      }
    }

    if consider {
      sum += gameNo
    }
  }

  fmt.Print(fmt.Sprintf("%d\n", sum))
}
