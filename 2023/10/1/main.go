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

  var x, y int
  var m [][]byte
  var s [][]int

  for {
    line, _ := getLine()
    if len(line) <= 0 { break }

    l1 := []byte{}
    l2 := []int{}

    for i := 0; i < len(line); i++ {
      l1 = append(l1, line[i])
      if line[i] == 'S' {
        x = i
        y = len(m)
        l2 = append(l2, 0)
        } else {
        l2 = append(l2, -1)
      }
    }

    m = append(m, l1)
    s = append(s, l2)
  }

  fmt.Println(x, y)
  fmt.Println(m)
  fmt.Println(s)

  max := 0

  check := func(x, y, current int) bool {
    old := s[y][x]

    if s[y][x] >= 0 {
      s[y][x] = min(s[y][x], current + 1)
    } else {
      s[y][x] = current + 1
    }

    if s[y][x] > max { max = s[y][x] }

    return s[y][x] != old
  }

  for {
    found := false

    max = 0

    for y := 0; y < len(s); y++ {
      for x := 0; x < len(s[y]); x++ {
        if s[y][x] >= 0 {
          if y > 0 && (m[y-1][x] == '|' || m[y-1][x] == '7' || m[y-1][x] == 'F') {
            found = found || check(x, y-1, s[y][x])
          }
          if x > 0 && (m[y][x-1] == '-' || m[y][x-1] == 'L' || m[y][x-1] == 'F') {
            found = found || check(x-1, y, s[y][x])
          }
          if x < len(s[y])-1 && (m[y][x+1] == '-' || m[y][x+1] == 'J' || m[y][x+1] == '7') {
            found = found || check(x+1, y, s[y][x])
          }
          if y < len(s)-1 && (m[y+1][x] == '|' || m[y+1][x] == 'J' || m[y+1][x] == 'L') {
            found = found || check(x, y+1, s[y][x])
          }
        }
      }
    }

    // fmt.Println(s)

    if (!found) { break }
  }

  // fmt.Println(s)
  fmt.Println(max)
}
