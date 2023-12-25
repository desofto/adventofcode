package main

import (
	"fmt"
	"math"
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

var hailstones []*tHailstone

func main() {
  data, err := os.ReadFile("./test.txt")
  if err != nil { panic(err) }
  lines := strings.Split(string(data), "\n")

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

  // for _, hailstone := range hailstones {
  //   fmt.Println(*hailstone)
  // }

  startHailstone := &tHailstone{
    x: 24,
    y: 13,
    z: 10,
    dx: -3,
    dy: 1,
    dz: 2,
  }

  for _, h := range hailstones {
    fmt.Println(linesCross(startHailstone, h), distance(startHailstone, h))
  }
}

func linesCross(hailstone1, hailstone2 *tHailstone) int {
  var tx float64
  var txOK bool
  if hailstone1.dx == hailstone2.dx {
    if hailstone2.x != hailstone1.x { return -1 }
  } else {
    tx = float64(hailstone2.x - hailstone1.x) / float64(hailstone1.dx - hailstone2.dx)
    txOK = true
  }

  var ty float64
  var tyOK bool
  if hailstone1.dy == hailstone2.dy {
    if hailstone2.y != hailstone1.y { return -1 }
  } else {
    ty = float64(hailstone2.y - hailstone1.y) / float64(hailstone1.dy - hailstone2.dy)
    tyOK = true
    if txOK && math.Abs(ty - tx) > 0.01 { return -1 }
  }

  var tz float64
  var tzOK bool
  if hailstone1.dz == hailstone2.dz {
    if hailstone2.z != hailstone1.z { return -1 }
  } else {
    tz = float64(hailstone2.z - hailstone1.z) / float64(hailstone1.dz - hailstone2.dz)
    tzOK = true
    if txOK && math.Abs(tz - tx) > 0.01 { return -1 }
    if tyOK && math.Abs(tz - ty) > 0.01 { return -1 }
  }

  if txOK { return int(tx) }
  if tyOK { return int(ty) }
  if tzOK { return int(tz) }

  panic("Wrong")
}

func validate(hailstone *tHailstone) int {
  cnt := 0

  for _, h := range hailstones {
    if linesCross(hailstone, h) >= 0 { cnt++ }
  }

  return cnt
}

func validate2(hailstone *tHailstone) float64 {
  dist := 0.0

  for _, h := range hailstones {
    dist += math.Pow(distance(hailstone, h), 2)
  }

  return dist
}

func distance(hailstone1, hailstone2 *tHailstone) float64 {
  return math.Abs(float64(
    hailstone1.dx*hailstone2.dy*(hailstone2.z-hailstone1.z) +
    (hailstone2.x-hailstone1.x)*hailstone1.dy*hailstone2.dz +
    hailstone2.dx*(hailstone2.y-hailstone1.y)*hailstone1.dz -
    (hailstone2.x-hailstone1.x)*hailstone2.dy*hailstone1.dz -
    hailstone1.dx*(hailstone2.y-hailstone1.y)*hailstone2.dz -
    hailstone2.dx*hailstone1.dy*(hailstone2.z-hailstone1.z)) / math.Sqrt(
    math.Pow(float64(hailstone1.dy * hailstone2.dz - hailstone2.dy * hailstone1.dz), 2) +
    math.Pow(float64(hailstone1.dx * hailstone2.dz - hailstone2.dx * hailstone1.dz), 2) +
    math.Pow(float64(hailstone1.dx * hailstone2.dy - hailstone2.dx * hailstone1.dy), 2)))
}
