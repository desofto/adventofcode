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

  var m [][]byte
  var s [][]int

  for {
    line, _ := getLine()
    if len(line) <= 0 { break }

    l1 := []byte{}
    l2 := []int{}

    for i := 0; i < len(line); i++ {
      ch := line[i]
      if ch == 'S' {
        ch = 'L'
        l2 = append(l2, 0)
        } else {
        l2 = append(l2, -1)
      }
      l1 = append(l1, ch)
    }

    m = append(m, l1)
    s = append(s, l2)
  }

  {
    check := func(x, y, current int) bool {
      old := s[y][x]

      if s[y][x] >= 0 {
        s[y][x] = min(s[y][x], current + 1)
      } else {
        s[y][x] = current + 1
      }

      return s[y][x] != old
    }

    for {
      found := false

      for y := 0; y < len(s); y++ {
        for x := 0; x < len(s[y]); x++ {
          if s[y][x] >= 0 {
            if m[y][x] == 'S' || m[y][x] == '|' || m[y][x] == 'J' || m[y][x] == 'L' {
              if y > 0 && (m[y-1][x] == '|' || m[y-1][x] == '7' || m[y-1][x] == 'F') {
                found = found || check(x, y-1, s[y][x])
              }
            }
            if m[y][x] == 'S' || m[y][x] == '-' || m[y][x] == 'J' || m[y][x] == '7' {
              if x > 0 && (m[y][x-1] == '-' || m[y][x-1] == 'L' || m[y][x-1] == 'F') {
                found = found || check(x-1, y, s[y][x])
              }
            }
            if m[y][x] == 'S' || m[y][x] == '-' || m[y][x] == 'L' || m[y][x] == 'F' {
              if x < len(s[y])-1 && (m[y][x+1] == '-' || m[y][x+1] == 'J' || m[y][x+1] == '7') {
                found = found || check(x+1, y, s[y][x])
              }
            }
            if m[y][x] == 'S' || m[y][x] == '|' || m[y][x] == '7' || m[y][x] == 'F' {
              if y < len(s)-1 && (m[y+1][x] == '|' || m[y+1][x] == 'J' || m[y+1][x] == 'L') {
                found = found || check(x, y+1, s[y][x])
              }
            }
          }
        }
      }

      if (!found) { break }
    }
  }

  for y := 0; y < len(s); y++ {
    for x := 0; x < len(s[y]); x++ {
      if s[y][x] < 0 {
        s[y][x] = 'O'
      } else {
        s[y][x] = ' '
      }
    }
  }

  {
    scanVT := func(x, y int) bool {
      pipes := make(map[byte]int)
      for i := y-1; i >= 0; i-- {
        if s[i][x] == ' ' { pipes[m[i][x]]++ }
      }

      m := min(pipes['J'], pipes['7'])
      pipes['J'] -= m
      pipes['7'] -= m

      m = min(pipes['F'], pipes['L'])
      pipes['F'] -= m
      pipes['L'] -= m

      return (pipes['-'] + (pipes['F'] + pipes['J']) / 2 + (pipes['L'] + pipes['7']) / 2) % 2 == 0
    }

    scanVB := func(x, y int) bool {
      pipes := make(map[byte]int)
      for i := y+1; i < len(s); i++ {
        if s[i][x] == ' ' { pipes[m[i][x]]++ }
      }

      m := min(pipes['J'], pipes['7'])
      pipes['J'] -= m
      pipes['7'] -= m

      m = min(pipes['F'], pipes['L'])
      pipes['F'] -= m
      pipes['L'] -= m

      return (pipes['-'] + (pipes['F'] + pipes['J']) / 2 + (pipes['L'] + pipes['7']) / 2) % 2 == 0
    }

    scanHL := func(x, y int) bool {
      pipes := make(map[byte]int)
      for i := x; i >= 0; i-- {
        if s[y][i] == ' ' { pipes[m[y][i]]++ }
      }

      m := min(pipes['J'], pipes['L'])
      pipes['J'] -= m
      pipes['L'] -= m

      m = min(pipes['F'], pipes['7'])
      pipes['F'] -= m
      pipes['7'] -= m

      return (pipes['|'] + (pipes['F'] + pipes['J']) / 2 + (pipes['L'] + pipes['7']) / 2) % 2 == 0
    }

    scanHR := func(x, y int) bool {
      pipes := make(map[byte]int)
      for i := x+1; i < len(m[y]); i++ {
        if s[y][i] == ' ' { pipes[m[y][i]]++ }
      }

      m := min(pipes['J'], pipes['L'])
      pipes['J'] -= m
      pipes['L'] -= m

      m = min(pipes['F'], pipes['7'])
      pipes['F'] -= m
      pipes['7'] -= m

      return (pipes['|'] + (pipes['F'] + pipes['J']) / 2 + (pipes['L'] + pipes['7']) / 2) % 2 == 0
    }

    for y := 0; y < len(s); y++ {
      for x := 0; x < len(s[y]); x++ {
        if s[y][x] == 'O' {
          vt := scanVT(x, y)
          vb := scanVB(x, y)
          hl := scanHL(x, y)
          hr := scanHR(x, y)

          res := vt && vb && hl && hr
          if vt != res || vb != res || hl != res || hr != res {
            fmt.Println(x, y, res, vt, vb, hl, hr)
          }

          if !res {
            s[y][x] = 'I'
          }
          // - FJ/L7
          // | L7/JF
        }
      }
    }
  }

  {
    cnt := 0
    for y, l := range s {
      str := ""
      for x, el := range l {
        if el == ' ' { el = int(m[y][x]) }
        str = str + fmt.Sprintf("%c ", el)
        if el == 'I' { cnt++ }
      }
      // fmt.Println(str)
    }
    fmt.Println(cnt) // < 4105 < 743 < 736 !=156 !=361 !=243 != 37
  }
}
