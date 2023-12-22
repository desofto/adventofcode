package main

import (
	"fmt"
	"math"
	"os"
	"strings"
)

type obj struct {
  x, y int64
}

var rocks map[int]map[int]byte
var occupied map[int]map[int]byte

var width int
var height int

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  lines := strings.Split(string(data), "\n")

  rocks = make(map[int]map[int]byte)
  occupied = make(map[int]map[int]byte)

  for y, line := range lines {
    if len(line) > 0 {
      for x, el := range line {
        if el == '#' {
          r, ok := rocks[y]
          if !ok {
            r = make(map[int]byte)
            rocks[y] = r
          }
          r[x] = '#'
        } else if el == 'S' {
          r, ok := occupied[y]
          if !ok {
            r = make(map[int]byte)
            occupied[y] = r
          }
          r[x] = 'O'
        }
      }
      width = len(line)
      height = y+1
    }
  }

  for step := 1; step <= 50000; step++ {
    newOccupied := make(map[int]map[int]byte)

    for y, r := range occupied {
      for x, _ := range r {
        rx := int(float64(x) - float64(width)*math.Floor(float64(x)/float64(width))) % int(width)
        ry := int(float64(y) - float64(height)*math.Floor(float64(y)/float64(height))) % int(height)

        if rocks[ry-1][rx] != '#' && newOccupied[y-1][x] != 'O' {
          r, ok := newOccupied[y-1]
          if !ok {
            r = make(map[int]byte)
            newOccupied[y-1] = r
          }
          r[x] = 'O'
        }
        if rocks[ry+1][rx] != '#' && newOccupied[y+1][x] != 'O' {
          r, ok := newOccupied[y+1]
          if !ok {
            r = make(map[int]byte)
            newOccupied[y+1] = r
          }
          r[x] = 'O'
        }
        if rocks[ry][rx-1] != '#' && newOccupied[y][x-1] != 'O' {
          r, ok := newOccupied[y]
          if !ok {
            r = make(map[int]byte)
            newOccupied[y] = r
          }
          r[x-1] = 'O'
        }
        if rocks[ry][rx+1] != '#' && newOccupied[y][x+1] != 'O' {
          r, ok := newOccupied[y]
          if !ok {
            r = make(map[int]byte)
            newOccupied[y] = r
          }
          r[x+1] = 'O'
        }
      }
    }

    occupied = newOccupied

    // if step % 10 == 0 {
    //   cnt := 0
    //   for _, r := range occupied {
    //     for _, _ = range r {
    //       cnt++
    //     }
    //   }
    //   fmt.Println(step, cnt)
    // }

    // new full ring every 262 steps after first 129
    // 101149 rounds => 129 + 101149*262 = 26501167 + 198 steps
    // (1 + round*2)**2 -> (1+101149*2)**2 = 40924885401 => 20462442701*7336 + 20462442700*7327 = 300040797317436 + ?

    // cnt := 0
    // n := 1
    // for _, o := range occupied {
    //   if o.x >= int64(-n*width) && o.x < int64((n+1)*width) && o.y >= int64(-n*height) && o.y < int64((n+1)*height) { cnt ++ }
    // }
    // c := float64(1+2*n)
    // if cnt >= 7336*int(math.Ceil(c*c/2)) + 7327*int(math.Floor(c*c/2)) {
    //   fmt.Println(step, cnt, len(occupied), len(occupied) - cnt)
    // }

    // 129+0*262+198  (327) =>   84651
    // 129+1*262+198  (589) =>  231571 146920
    // 129+2*262+198  (851) =>  437143 205572 58652
    // 129+3*262+198 (1113) =>  701367 264224 58652
    // 129+4*262+198 (1375) => 1024243 322876 58652
    // 129+5*262+198 (1637) => 1405771 381528 58652

    // 437143+(437143-231571)+58652

    // f(1) = 231571, f(2) = 437143, f(n) = 2*f(n-1) - f(n-2) + 58652
    // f(101149) = 300049725614683

    // !!! => 300040797317436 + 300049725614683 = 600090522932119

    for n := 0; n < 10; n++ {
      if step == 129 + n*262 + 198 {
        cnt := 0
        for _, r := range occupied {
          for _, _ = range r {
            cnt++
          }
        }

        c := float64(1+2*n)
        o := 7336*int(math.Ceil(c*c/2)) + 7327*int(math.Floor(c*c/2))
        fmt.Println("Step #", step)
        fmt.Println("Rest: ", cnt-o)
        fmt.Println("Real: ", cnt)
        fmt.Println("Calculated: ", o + f(n))
      }
    }
  }
}

func main2() {
  // f(1) = 231571, f(2) = 437143, f(n) = 2*f(n-1) - f(n-2) + 58652
  // f(101149) = 300049725614683
  // fmt.Println(f(5))
  fmt.Println(f(101149))
}

func f(n int) int {
  f1 := 231571
  f2 := 437143

  for {
    f3 := 2*f2 - f1 + 58652
    n--
    if n <= 2 { return f3 }
    f1 = f2
    f2 = f3
  }
}
