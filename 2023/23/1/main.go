package main

import (
	"fmt"
	"os"
	"strings"
)

const (
  right = iota
  down = iota
  left = iota
  top = iota
)

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  lines := strings.Split(string(data), "\n")

  var input [][]byte
  var route [][][4]int
  for _, line := range lines {
    if len(line) > 0 {
      input = append(input, []byte(line))
      route = append(route, make([][4]int, len(line)))
    }
  }

  route[0][1][down] = 1

  // fmt.Println(input)
  fmt.Println(route)

  for {
    done := true

    for y := 0; y < len(route); y++ {
      for x := 0; x < len(route[y]); x++ {
        for dir := right; dir <= top; dir++ {
          if route[y][x][dir] <= 0 { continue }
          if dir != down && y > 0 && route[y-1][x][top] <= route[y][x][dir] && (input[y][x] == '.' || input[y][x] == '^') && (input[y-1][x] == '.' || input[y-1][x] == '^' || input[y-1][x] == '<' || input[y-1][x] == '>') {
            route[y-1][x][top] = route[y][x][dir] + 1
            done = false
          }
          if dir != right && x > 0 && route[y][x-1][left] <= route[y][x][dir] && (input[y][x] == '.' || input[y][x] == '<') && (input[y][x-1] == '.' || input[y][x-1] == '<' || input[y][x-1] == '^' || input[y][x-1] == 'v') {
            route[y][x-1][left] = route[y][x][dir] + 1
            done = false
          }
          if dir != top && y < len(route)-1 && route[y+1][x][down] <= route[y][x][dir] && (input[y][x] == '.' || input[y][x] == 'v') && (input[y+1][x] == '.' || input[y+1][x] == 'v' || input[y+1][x] == '<' || input[y+1][x] == '>') {
            route[y+1][x][down] = route[y][x][dir] + 1
            done = false
          }
          if dir != left && x < len(route[y])-1 && route[y][x+1][right] <= route[y][x][dir] && (input[y][x] == '.' || input[y][x] == '>') && (input[y][x+1] == '.' || input[y][x+1] == '>' || input[y][x+1] == '^' || input[y][x+1] == 'v') {
            route[y][x+1][right] = route[y][x][dir] + 1
            done = false
          }
        }
      }
    }

    if (done) { break }
  }

  for y := 0; y < len(input); y++ {
    s := ""
    for x := 0; x < len(input[y]); x++ {
      steps := max(route[y][x][right], route[y][x][down], route[y][x][left], route[y][x][top])
      if steps > 0 {
        s = s + fmt.Sprintf("%2d", steps) + " "
      } else {
        s = s + string(input[y][x]) + "  "
      }
    }
    fmt.Println(s)
  }

  cell := route[len(route)-1][len(route[len(route)-1])-2]
  fmt.Println(max(cell[right], cell[down], cell[left], cell[top])-1)
}
