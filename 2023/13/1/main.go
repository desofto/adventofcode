package main

import (
	"fmt"
	"math"
	"os"
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

  var pattern []string

  sum := 0

  for {
    line, end := getLine()
    if len(line) <= 0 { break }

    pattern = append(pattern, line)

    if end {
      for _, line := range pattern {
        fmt.Println(line)
      }

      checkVreflection := func(x1, x2 int) bool {
        for {
          for y := 0; y < len(pattern); y++ {
            if pattern[y][x1] != pattern[y][x2] { return false }
          }
          x1++
          x2--
          if x1 > x2 { return true }
        }
      }

      checkHreflection := func(y1, y2 int) bool {
        for {
          for x := 0; x < len(pattern[y1]); x++ {
            if pattern[y1][x] != pattern[y2][x] { return false }
          }
          y1++
          y2--
          if y1 > y2 { return true }
        }
      }

      ch := 0
      res := 0

      y1 := 0
      for y2 := len(pattern)-1; y2 > y1; y2-- {
        if checkHreflection(y1, y2) {
          fmt.Println("H:", y1, y2, math.Floor(0.5+float64(y2+y1)/2))
          if y2-y1 > ch {
            res = int(100 * (math.Floor(0.5+float64(y2+y1)/2)))
            ch = y2-y1
          }
          break
        }
      }

      y2 := len(pattern)-1
      for y1 := 0; y1 < y2; y1++ {
        if checkHreflection(y1, y2) {
          fmt.Println("H:", y1, y2, math.Floor(0.5+float64(y2+y1)/2))
          if y2-y1 > ch {
            res = int(100 * (math.Floor(0.5+float64(y2+y1)/2)))
            ch = y2-y1
          }
          break
        }
      }

      x1 := 0
      for x2 := len(pattern[0])-1; x2 > x1; x2-- {
        if checkVreflection(x1, x2) {
          fmt.Println("V:", x1, x2, math.Floor(0.5+float64(x2+x1)/2))
          if x2-x1 > ch {
            res = int(math.Floor(0.5+float64(x2+x1)/2))
            ch = x2-x1
          }
          break
        }
      }

      x2 := len(pattern[0])-1
      for x1 := 0; x1 < x2; x1++ {
        if checkVreflection(x1, x2) {
          fmt.Println("V:", x1, x2, math.Floor(0.5+float64(x2+x1)/2))
          if x2-x1 > ch {
            res = int(math.Floor(0.5+float64(x2+x1)/2))
            ch = x2-x1
          }
          break
        }
      }

      if ch > 0 {
        sum += res
      } else {
        panic("!")
      }

      fmt.Println()
      pattern = make([]string, 0)
    }
  }

  fmt.Println(sum) // < 31338 > 7600 < 31237
}
