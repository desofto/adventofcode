package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type tHailstone struct {
  x,y,z int
  dx,dy,dz int
}

func s2i(s string) int {
  r, err := strconv.Atoi(strings.Trim(s, " "))
  if err != nil { panic(err) }
  return r
}

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  lines := strings.Split(string(data), "\n")

  var hailstones []*tHailstone

  for _, line := range lines {
    if len(line) > 0 {
      hailstone := &tHailstone{}

      coords := strings.Split(line, "@")
      c1 := strings.Split(coords[0], ",")
      hailstone.x = s2i(c1[0])
      hailstone.y = s2i(c1[1])
      hailstone.z = s2i(c1[2])
      c2 := strings.Split(coords[1], ",")
      hailstone.dx = s2i(c2[0])
      hailstone.dy = s2i(c2[1])
      hailstone.dz = s2i(c2[2])

      hailstones = append(hailstones, hailstone)
    }
  }

  for _, hailstone := range hailstones {
    fmt.Println(*hailstone)
  }

  cnt := 0

  // minRange := 7
  // maxRange := 27
  minRange := 200000000000000
  maxRange := 400000000000000

  for i1 := 0; i1 < len(hailstones); i1++ {
    for i2 := i1+1; i2 < len(hailstones); i2++ {
      hailstone1 := hailstones[i1]
      hailstone2 := hailstones[i2]

      a1 := float64(hailstone1.dy) / float64(hailstone1.dx)
      b1 := float64(hailstone1.y) - float64(hailstone1.x) * a1
      a2 := float64(hailstone2.dy) / float64(hailstone2.dx)
      b2 := float64(hailstone2.y) - float64(hailstone2.x) * a2

      x := (b1 - b2) / (a2 - a1)
      y := a1 * x + b1

      n1 := (x - float64(hailstone1.x)) / float64(hailstone1.dx)
      n2 := (x - float64(hailstone2.x)) / float64(hailstone2.dx)

      fmt.Println(i1, i2, x, y, n1, n2)
      // panic("!")

      if x >= float64(minRange) && x <= float64(maxRange) && y >= float64(minRange) && y <= float64(maxRange) && n1 >= 0 && n2 >= 0 {
        cnt++
      }
    }
  }

  fmt.Println(cnt)
}
