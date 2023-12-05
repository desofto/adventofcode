package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type record struct {
  dst int
  src int
  len int
}

type category struct {
  records []record
}

func (c *category) convert(src int) int {
  for _, r := range c.records {
    if src >= r.src && src <= r.src + r.len {
      return r.dst + (src - r.src)
    }
  }
  return src
}

func (c *category) append(dst int, src int, len int) {
  c.records = append(c.records, record{
    dst: dst,
    src: src,
    len: len,
  })
}

type almanac struct {
  maps map[string]*category
}

func (a *almanac) append(name string, dst int, src int, len int) {
  cat, ok := a.maps[name]
  if !ok {
    cat = &category{}
    a.maps[name] = cat
  }

  cat.append(dst, src, len)
}

func (a *almanac) convert(name string, src int) int {
  if name == "seed" { return src }
  for categoryName, category := range a.maps {
    parts := strings.Split(categoryName, "-to-")
    if parts[1] == name {
      dst := category.convert(a.convert(parts[0], src))
      return dst
    }
  }
  panic(fmt.Sprintf("Cannot convert into %s", name))
}

func newAlmanac() *almanac {
  return &almanac{make(map[string]*category)}
}

var Almanac = newAlmanac()

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

  line, _ := getLine()
  line = strings.Trim(strings.Split(line, ":")[1], " ")

  seeds := strings.Split(line, " ")

  for {
    line, _ := getLine()
    if len(line) <= 0 { break }
    name := strings.Split(line, " ")[0]

    for {
      line, end := getLine()

      arr := strings.Split(line, " ")

      dst, err := strconv.Atoi(arr[0])
      if err != nil { panic(err) }

      src, err := strconv.Atoi(arr[1])
      if err != nil { panic(err) }

      len, err := strconv.Atoi(arr[2])
      if err != nil { panic(err) }

      Almanac.append(name, dst, src, len)

      if end { break }
    }
  }

  lowest := -1

  for _, seed := range seeds {
    n, err := strconv.Atoi(seed)
    if err != nil { panic(err) }
    dst := Almanac.convert("location", n)
    fmt.Println(fmt.Sprintf("%d -> %d", n, dst))
    if lowest < 0 || dst < lowest { lowest = dst }
  }

  fmt.Println(lowest)
}
