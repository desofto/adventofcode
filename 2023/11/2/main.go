package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  input := strings.Split(string(data), "\n")

  var m [][]byte

  for _, line := range(input) {
    if len(line) <= 0 { continue }
    var l []byte
    for _, ch := range(strings.Split(line, "")) {
      l = append(l, byte(ch[0]))
    }
    m = append(m, l)
  }

  emptyLine := make(map[int]bool)
  emptyColumn := make(map[int]bool)

  for y := 0; y < len(m); y++ {
    isEmpty := true
    for x := 0; x < len(m[y]); x++ {
      if m[y][x] == '#' {
        isEmpty = false
        break
      }
    }
    if isEmpty {
      emptyLine[y] = true
    }
  }

  for x := 0; x < len(m[0]); x++ {
    isEmpty := true
    for y := 0; y < len(m); y++ {
      if m[y][x] == '#' {
        isEmpty = false
        break
      }
    }
    if isEmpty {
      emptyColumn[x] = true
    }
  }

  sum := 0

  cnt := 0

  y1 := 0
  x1 := 0

  for {
    if m[y1][x1] == '#' {
      y2 := y1
      x2 := x1

      for {
        x2++
        if x2 >= len(m[y2]) {
          y2++
          if y2 >= len(m) { break }
          x2 = 0
        }

        if m[y2][x2] == '#' {
          cnt++
          steps := (max(x1,x2) - min(x1,x2)) + (max(y1,y2) - min(y1,y2))
          for y, isEmpty := range emptyLine {
            if isEmpty && y >= min(y1, y2) && y <= max(y1, y2) {
              steps += 1_000_000-1
            }
          }
          for x, isEmpty := range emptyColumn {
            if isEmpty && x >= min(x1, x2) && x <= max(x1, x2) {
              steps += 1_000_000-1
            }
          }
          sum += steps

          fmt.Println(cnt, x1, y1, "=>", x2, y2, ":", steps, sum)
        }
      }
    }

    x1++
    if x1 >= len(m[y1]) {
      y1++
      if y1 >= len(m) { break }
      x1 = 0
    }
  }

  fmt.Println(sum)
}
