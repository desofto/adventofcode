package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
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

  tick = time.Now()
  sum := 0

  for {
    line, _ := getLine()
    if len(line) <= 0 { break }

    parts := strings.Split(line, " ")
    conditions := parts[0] + string('?') + parts[0] + string('?') + parts[0] + string('?') + parts[0] + string('?') + parts[0]
    var broken []int
    for _, l := range strings.Split(parts[1], ",") {
      i, err := strconv.Atoi(l)
      if err != nil { panic(err) }
      broken = append(broken, i)
    }
    broken = append(append(append(append(broken, broken...), broken...), broken...), broken...)

    cache = make(map[int]int)

    count := arrangements([]rune(conditions), broken)
    fmt.Println(conditions, broken, count)
    sum += count
    // break
  }

  fmt.Println(sum)
}

var cache map[int]int
var tick time.Time

func arrangements(conditions []rune, broken []int) int {
  // total := 0
  // for _, el := range broken { total += el }

  // br := 0
  // q := 0
  // for i := 0; i < len(conditions); i++ {
  //   if conditions[i] == '#' { br++ }
  //   if conditions[i] == '?' { q++ }
  // }

  // if br > total || br + q < total { return 0 }

  {
    fullEqual, _ := validate(conditions, broken)
    if fullEqual { return 1 }
  }

  t := time.Now()
  if t.Sub(tick).Seconds() > 5 {
    tick = t
    fmt.Println(string(conditions), broken)
  }

  {
    result := 0

    br := 0
    for i := 0; i < len(conditions); i++ {
      if conditions[i] == '#' { br++ }
      if conditions[i] == '?' {
        if i > 0 {
          _, partlyEqual := validate(conditions[:i], broken)
          if !partlyEqual {
            break
          }
        }

        s := []rune(string(conditions))

        s[i] = '.'
        h := br*1000 + i
        res, ok := cache[h]
        if !ok {
          res = arrangements(s, broken)
          cache[h] = res
        }
        result += res
        s[i] = '#'
        result += arrangements(s, broken)
        break
      }
    }

    return result
  }
}
// 506_250

func validate(conditions []rune, broken []int) (bool, bool) {
  equal := true
  index := 0
  l := 0
  for i := 0; i < len(conditions); i++ {
    if conditions[i] == '.' {
      if l > 0 {
        if index < len(broken) && broken[index] != l {
          equal = false
          break
        }
        index++
        l = 0
      }
    } else if conditions[i] == '#' {
      l++
      if index >= len(broken) || l > broken[index] {
        equal = false
        break
      }
    } else {
      equal = false
      break
    }
  }
  partlyEqual := equal
  if l > 0 {
    if index < len(broken) {
      if l != broken[index] {
        equal = false
      }
      if l > broken[index] {
        partlyEqual = false
      }
    }
    index++
  }
  if index != len(broken) {
    equal = false
  }

  return equal, partlyEqual
}
