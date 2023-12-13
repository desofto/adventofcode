package main

import (
	"fmt"
	"os"
	"strconv"
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

  sum := 0

  for {
    line, _ := getLine()
    if len(line) <= 0 { break }

    parts := strings.Split(line, " ")
    conditions := parts[0]
    var broken []int
    for _, l := range strings.Split(parts[1], ",") {
      i, err := strconv.Atoi(l)
      if err != nil { panic(err) }
      broken = append(broken, i)
    }

    count := arrangements([]rune(conditions), broken)
    fmt.Println(conditions, broken, count)
    sum += count
  }

  fmt.Println(sum)
}

func arrangements(conditions []rune, broken []int) int {
  {
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
    if l > 0 {
      if index < len(broken) && broken[index] != l {
        equal = false
      }
      index++
    }
    if equal && index == len(broken) {
      return 1
    }
  }

  {
    result := 0

    for i := 0; i < len(conditions); i++ {
      if conditions[i] == '?' {
        s := []rune(string(conditions))
        s[i] = '.'
        result += arrangements(s, broken)
        s[i] = '#'
        result += arrangements(s, broken)
        break
      }
    }

    return result
  }
}
