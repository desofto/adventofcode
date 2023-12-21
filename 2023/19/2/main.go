package main

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

type tDummyPart struct {
  minX, maxX int
  minM, maxM int
  minA, maxA int
  minS, maxS int
}

type tRule struct {
  attr rune
  condition rune
  value int
  next string
}

var workflows map[string][]tRule

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  input := strings.Split(string(data), "\n")

  parser1 := regexp.MustCompile(`(\w+)\{(.+)\}`)
  parser2 := regexp.MustCompile(`(\w)([\>\<])(\d+)\:(\w+)`)

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

  workflows = make(map[string][]tRule)

  for {
    line, end := getLine()
    if len(line) <= 0 { break }

    res := parser1.FindAllStringSubmatch(line, -1)[0]
    name := res[1]

    var rules []tRule

    for _, str := range strings.Split(res[2], ",") {
      res := parser2.FindAllStringSubmatch(str, -1)
      if len(res) > 0 {
        res := res[0]
        value, err := strconv.Atoi(res[3])
        if err != nil { panic(err) }
        rules = append(rules, tRule{
          attr: rune(res[1][0]),
          condition: rune(res[2][0]),
          value: value,
          next: res[4],
        })
      } else {
        rules = append(rules, tRule{
          attr: 0,
          condition: 0,
          value: 0,
          next: str,
        })
      }
    }

    workflows[name] = rules

    if end { break }
  }

  fmt.Println(workflows)
  fmt.Println()

  process("in", tDummyPart{
    minX: 1,
    maxX: 4000,
    minM: 1,
    maxM: 4000,
    minA: 1,
    maxA: 4000,
    minS: 1,
    maxS: 4000,
  })

  fmt.Println(dummyParts)

  sum := 0
  for _, part := range dummyParts {
    sum += (part.maxX - part.minX + 1) * (part.maxM - part.minM + 1) * (part.maxA - part.minA + 1) * (part.maxS - part.minS + 1)
  }
  fmt.Println(sum)
}

var dummyParts []tDummyPart

func process(workflowName string, part tDummyPart) {
  if workflowName == "A" {
    fmt.Println(part)
    dummyParts = append(dummyParts, part)
    return
  }
  if workflowName == "R" { return }

  rules := workflows[workflowName]

  for _, rule := range rules {
    if rule.attr == 0 && rule.condition == 0 && rule.value == 0 {
      process(rule.next, part)
      return
    }

    newPart := part
    switch rule.attr {
    case 'x':
      if rule.condition == '<' {
        newPart.maxX = min(newPart.maxX, rule.value-1)
        part.minX = max(part.minX, rule.value)
      } else {
        newPart.minX = max(newPart.minX, rule.value+1)
        part.maxX = min(part.maxX, rule.value)
      }
    case 'm':
      if rule.condition == '<' {
        newPart.maxM = min(newPart.maxM, rule.value-1)
        part.minM = max(part.minM, rule.value)
      } else {
        newPart.minM = max(newPart.minM, rule.value+1)
        part.maxM = min(part.maxM, rule.value)
      }
    case 'a':
      if rule.condition == '<' {
        newPart.maxA = min(newPart.maxA, rule.value-1)
        part.minA = max(part.minA, rule.value)
      } else {
        newPart.minA = max(newPart.minA, rule.value+1)
        part.maxA = min(part.maxA, rule.value)
      }
    case 's':
      if rule.condition == '<' {
        newPart.maxS = min(newPart.maxS, rule.value-1)
        part.minS = max(part.minS, rule.value)
      } else {
        newPart.minS = max(newPart.minS, rule.value+1)
        part.maxS = min(part.maxS, rule.value)
      }
    default:
      panic("Wrong rule")
    }
    process(rule.next, newPart)
  }
}
