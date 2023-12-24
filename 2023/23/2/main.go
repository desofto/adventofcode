package main

import (
	"fmt"
	"os"
	"slices"
	"strings"
)

const (
  up = iota
  left = iota
  right = iota
  down = iota
)

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  lines := strings.Split(string(data), "\n")

  var input [][]byte

  for _, line := range lines {
    if len(line) > 0 {
      input = append(input, []byte(line))
    }
  }

  type tCrossroad struct {
    id int
    x, y int
    steps map[int]int
  }

  var crossroads []*tCrossroad

  isCrossroad := func(x, y int) bool {
    if input[y][x] == '#' { return false }

    cnt := 0
    if input[y-1][x] != '#' { cnt++ }
    if input[y][x-1] != '#' { cnt++ }
    if input[y][x+1] != '#' { cnt++ }
    if input[y+1][x] != '#' { cnt++ }

    return cnt > 2
  }

  findCrossroad := func(x, y int) *tCrossroad {
    for _, crocrossroad := range crossroads {
      if crocrossroad.x == x && crocrossroad.y == y {
        return crocrossroad
      }
    }
    return nil
  }

  id := 0

  start := &tCrossroad{
    id: id,
    x: 1,
    y: 0,
    steps: make(map[int]int),
  }
  id++
  crossroads = append(crossroads, start)

  finish := &tCrossroad{
    id: id,
    x: len(input[len(input)-1])-2,
    y: len(input)-1,
    steps: make(map[int]int),
  }
  id++
  crossroads = append(crossroads, finish)

  for y := 1; y < len(input)-1; y++ {
    for x := 1; x < len(input[y])-1; x++ {
      if isCrossroad(x, y) {
        crossroads = append(crossroads, &tCrossroad{
          id: id,
          x: x,
          y: y,
          steps: make(map[int]int),
        })
        id++
      }
    }
  }

  fmt.Println(len(crossroads))

  for _, crossroad := range crossroads {
    for firstMove := up; firstMove <= down; firstMove++ {
      x := crossroad.x
      y := crossroad.y
      steps := 0
      dir := firstMove

      for {
        if (steps == 0 && dir == up || steps > 0 && dir != down) && y > 0 && input[y-1][x] != '#' {
          dir = up; y--; steps++
        } else if (steps == 0 && dir == left || steps > 0 && dir != right) && x > 0 && input[y][x-1] != '#' {
          dir = left; x--; steps++
        } else if (steps == 0 && dir == right || steps > 0 && dir != left) && x < len(input[y])-1 && input[y][x+1] != '#' {
          dir = right; x++; steps++
        } else if (steps == 0 && dir == down || steps > 0 && dir != up) && y < len(input)-1 && input[y+1][x] != '#' {
          dir = down; y++; steps++
        } else {
          break
        }

        crossroad2 := findCrossroad(x, y)
        if crossroad2 != nil {
          crossroad.steps[crossroad2.id] = steps
          break
        }
      }
    }
  }

  // for _, crossroad := range crossroads {
  //   fmt.Println(*crossroad)
  // }

  maxSteps := 0

  var findRoute func(from *tCrossroad, steps int, route []int)
  findRoute = func(from *tCrossroad, steps int, route []int) {
    // fmt.Println(from.id, steps, route)

    route = append(route, from.id)

    if from == finish {
      if steps > maxSteps { maxSteps = steps }
      return
    }

    for nextID, nextSteps := range from.steps {
      if slices.Contains(route, nextID) { continue }
      findRoute(crossroads[nextID], steps + nextSteps, route)
    }
  }

  findRoute(start, 0, []int{})

  fmt.Println(maxSteps)
}
