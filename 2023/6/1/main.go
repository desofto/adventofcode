package main

import (
	"fmt"
	"math"
)

// x*x - x*time + distance < 0
// 2-5
// 4-11
// 11-19

// 12-47=36
// 23-45=23
// 37-45=9
// 19-55=37

// 59688274
// 543102016641022

// 29844137 - sqrt(347570496633747) = 11200895
// 29844137 + sqrt(347570496633747) = 48487379

func race(time float64, distance float64) int64 {
  d := math.Pow(-time, 2) - 4*1*distance
  dSqrt := math.Sqrt(d)
  x1 := (time - dSqrt) / 2
  x2 := (time + dSqrt) / 2
  return int64(math.Ceil(x2 - 1) - math.Floor(x1 + 1) + 1)
}

func main() {
  // r1 := race(7, 9)    // 4
  // r2 := race(15, 40)  // 8
  // r3 := race(30, 200) // 9
  // fmt.Println(r1, r2, r3, r1*r2*r3)

  r1 := race(59, 543)
  r2 := race(68, 1020)
  r3 := race(82, 1664)
  r4 := race(74, 1022)
  fmt.Println(r1*r2*r3*r4)
}
