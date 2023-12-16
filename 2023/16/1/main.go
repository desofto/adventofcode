package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

const (
  right = 1
  down = 2
  left = 4
  up = 8
)

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  lines := strings.Split(string(data), "\n")

  var input [][]byte
  var energized [][]byte
  for _, line := range lines {
    if len(line) > 0 {
      input = append(input, []byte(line))
      energized = append(energized, make([]byte, len(line)))
    }
  }

  energized[0][0] = down

  for {
    changed := false

    for y := 0; y < len(energized); y++ {
      for x := 0; x < len(energized[y]); x++ {
        if energized[y][x] & right != 0 && x < len(energized[y])-1 {
          old := energized[y][x+1]
          if input[y][x+1] == '.' { energized[y][x+1] |= right }
          if input[y][x+1] == '-' { energized[y][x+1] |= right }
          if input[y][x+1] == '|' { energized[y][x+1] |= up | down }
          if input[y][x+1] == '/' { energized[y][x+1] |= up }
          if input[y][x+1] == '\\' { energized[y][x+1] |= down }
          if energized[y][x+1] != old { changed = true }
        }
        if energized[y][x] & down != 0 && y < len(energized)-1 {
          old := energized[y+1][x]
          if input[y+1][x] == '.' { energized[y+1][x] |= down }
          if input[y+1][x] == '-' { energized[y+1][x] |= left | right }
          if input[y+1][x] == '|' { energized[y+1][x] |= down }
          if input[y+1][x] == '/' { energized[y+1][x] |= left }
          if input[y+1][x] == '\\' { energized[y+1][x] |= right }
          if energized[y+1][x] != old { changed = true }
        }
        if energized[y][x] & left != 0 && x > 0 {
          old := energized[y][x-1]
          if input[y][x-1] == '.' { energized[y][x-1] |= left }
          if input[y][x-1] == '-' { energized[y][x-1] |= left }
          if input[y][x-1] == '|' { energized[y][x-1] |= up | down }
          if input[y][x-1] == '/' { energized[y][x-1] |= down }
          if input[y][x-1] == '\\' { energized[y][x-1] |= up }
          if energized[y][x-1] != old { changed = true }
        }
        if energized[y][x] & up != 0 && y > 0 {
          old := energized[y-1][x]
          if input[y-1][x] == '.' { energized[y-1][x] |= up }
          if input[y-1][x] == '-' { energized[y-1][x] |= left | right }
          if input[y-1][x] == '|' { energized[y-1][x] |= up }
          if input[y-1][x] == '/' { energized[y-1][x] |= right }
          if input[y-1][x] == '\\' { energized[y-1][x] |= left }
          if energized[y-1][x] != old { changed = true }
        }
      }
    }

    if !changed { break }
  }

  count := 0
  for y := 0; y < len(energized); y++ {
    s := ""
    for x := 0; x < len(energized[y]); x++ {
      num := 0
      var ch byte
      if energized[y][x] & right != 0 {
        num++
        ch = '>'
      }
      if energized[y][x] & down != 0 {
        num++
        ch = 'v'
      }
      if energized[y][x] & left != 0 {
        num++
        ch = '<'
      }
      if energized[y][x] & up != 0 {
        num++
        ch = '^'
      }
      if num > 0 { count++ }
      if input[y][x] == '.' {
        if num > 1 {
          s = s + strconv.Itoa(num)
        } else if num > 0 {
          s = s + string(ch)
        } else {
          s = s + " "
        }
      } else {
        s = s + string(input[y][x])
      }
    }
    fmt.Println(s)
  }
  fmt.Println(count) // < 8620
}
