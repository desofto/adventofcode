package main

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

type tRule struct {
  attr rune
  condition rune
  value int
  next string
}

type tPart struct {
  x, m, a, s int
}

func (p *tPart) getValue(name string) int {
  switch name {
  case "x":
    return p.x
  case "m":
    return p.m
  case "a":
    return p.a
  case "s":
    return p.s
  default:
    panic("Wrong attribute name")
  }
}

func (p *tPart) setValue(name string, value int) {
  switch name {
  case "x":
    p.x = value
  case "m":
    p.m = value
  case "a":
    p.a = value
  case "s":
    p.s = value
  default:
    panic("Wrong attribute name")
  }
}
var workflows map[string][]tRule

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  input := strings.Split(string(data), "\n")

  parser1 := regexp.MustCompile(`(\w+)\{(.+)\}`)
  parser2 := regexp.MustCompile(`(\w)([\>\<])(\d+)\:(\w+)`)
  parser3 := regexp.MustCompile(`\{(.+)\}`)
  parser4 := regexp.MustCompile(`(\w)\=(\d+)`)

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

  var parts []tPart

  for {
    line, end := getLine()
    if len(line) <= 0 { break }

    res := parser3.FindAllStringSubmatch(line, -1)[0]

    part := tPart{}

    for _, attr := range strings.Split(res[1], ",") {
      res := parser4.FindAllStringSubmatch(attr, -1)[0]
      value, err := strconv.Atoi(res[2])
      if err != nil { panic(err) }
      part.setValue(res[1], value)
    }

    parts = append(parts, part)

    if end { break }
  }

  fmt.Println(parts)
  fmt.Println()

  sum := 0
  for _, part := range parts {
    accepted := process("in", part)
    fmt.Println(part, accepted)
    if accepted {
      sum += part.x + part.m + part.a + part.s
    }
  }
  fmt.Println(sum)
}

func process(workflowName string, part tPart) bool {
  if workflowName == "A" { return true }
  if workflowName == "R" { return false }

  rules := workflows[workflowName]

  for _, rule := range rules {
    if rule.attr == 0 && rule.condition == 0 && rule.value == 0 {
      return process(rule.next, part)
    }
    if rule.condition == '<' && part.getValue(string(rule.attr)) < rule.value {
      return process(rule.next, part)
    }
    if rule.condition == '>' && part.getValue(string(rule.attr)) > rule.value {
      return process(rule.next, part)
    }
  }
  fmt.Println(workflowName, workflows[workflowName])
  panic("Wrong workflow")
}
