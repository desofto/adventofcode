package main

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

type slot struct {
  name string
  power int
}

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  lines := strings.Split(string(data), "\n")

  // fmt.Println(hash("pc"))

  fmt.Println(lines[0])

  var boxes [256][]slot

  parser := regexp.MustCompile(`(\w+)([-=])(\d+)?`)

  for _, str := range strings.Split(lines[0], ",") {
    res := parser.FindAllStringSubmatch(str, -1)[0]
    name := res[1]
    operation := res[2]
    box := hash(name)
    switch operation {
    case "-":
      for i := 0; i < len(boxes[box]); i++ {
        if boxes[box][i].name == name {
          boxes[box] = append(boxes[box][:i], boxes[box][i+1:]...)
          break
        }
      }
    case "=":
      power, err := strconv.Atoi(string(res[3]))
      if err != nil { panic(err) }
      found := false
      for i := 0; i < len(boxes[box]); i++ {
        if boxes[box][i].name == name {
          boxes[box][i].power = power
          found = true
          break
        }
      }
      if !found {
        boxes[box] = append(boxes[box], slot{name: name, power: power})
      }
    default:
      panic("Wrong operation")
    }
  }

  sum := 0
  for boxNo, box := range boxes {
    for slotNo, slot := range box {
      sum += (1 + boxNo) * (1 + slotNo) * slot.power
    }
  }
  fmt.Println(sum)
}

func hash(str string) int {
  val := 0
  for _, ch := range str {
    val = ((val + int(ch)) * 17) % 256
  }
  return val
}
