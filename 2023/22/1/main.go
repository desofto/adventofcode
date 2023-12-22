package main

import (
	"fmt"
	"os"
	"slices"
	"strconv"
	"strings"
)

type tBrick struct {
  index int
  x1,y1,z1 int
  x2,y2,z2 int
  supporters []int
}

var bricks []*tBrick

func s2i(s string) int {
  r, err := strconv.Atoi(s)
  if err != nil { panic(err) }
  return r
}

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  lines := strings.Split(string(data), "\n")

  for _, line := range lines {
    if len(line) > 0 {
      brick := &tBrick{ index: len(bricks) }

      coords := strings.Split(line, "~")
      c1 := strings.Split(coords[0], ",")
      brick.x1 = s2i(c1[0])
      brick.y1 = s2i(c1[1])
      brick.z1 = s2i(c1[2])
      c2 := strings.Split(coords[1], ",")
      brick.x2 = s2i(c2[0])
      brick.y2 = s2i(c2[1])
      brick.z2 = s2i(c2[2])

      bricks = append(bricks, brick)
    }
  }

  for {
    done := true

    for _, brick := range bricks {
      z := min(brick.z1, brick.z2)
      if z > 1 {
        canFall := true

        for y := min(brick.y1, brick.y2); canFall && y <= max(brick.y1, brick.y2); y++ {
          for x := min(brick.x1, brick.x2); canFall && x <= max(brick.x1, brick.x2); x++ {
            if check(x, y, z-1) >= 0 {
              canFall = false
            }
          }
        }

        if canFall {
          brick.z1--
          brick.z2--
          done = false
        }
      }
    }

    if done { break }
  }

  for _, brick := range bricks {
    z := min(brick.z1, brick.z2)
    if z > 1 {
      for y := min(brick.y1, brick.y2); y <= max(brick.y1, brick.y2); y++ {
        for x := min(brick.x1, brick.x2); x <= max(brick.x1, brick.x2); x++ {
          sup := check(x, y, z-1)
          if sup >= 0 {
            if !slices.Contains(brick.supporters, sup) {
              brick.supporters = append(brick.supporters, sup)
            }
          }
        }
      }
    }
  }

  count := 0
  for _, brick := range bricks {
    safeToRemove := true

    for _, b := range bricks {
      if len(b.supporters) == 1 && b.supporters[0] == brick.index {
        safeToRemove = false
        break
      }
    }

    if safeToRemove {
      count++
    }

    fmt.Println(*brick, safeToRemove)
  }

  fmt.Println(count)
  // < 522
}

func check(x, y, z int) int {
  for _, brick := range bricks {
    if x >= min(brick.x1, brick.x2) && x <= max(brick.x1, brick.x2) && y >= min(brick.y1, brick.y2) && y <= max(brick.y1, brick.y2) && z >= min(brick.z1, brick.z2) && z <= max(brick.z1, brick.z2) {
      return brick.index
    }
  }
  return -1
}
