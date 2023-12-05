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

func (c *category) source(dst int, callback func(int, bool)) {
  found := false
  for _, r := range c.records {
    if dst >= r.dst && dst <= r.dst + r.len {
      found = true
      src := r.src + (dst - r.dst)
      callback(src, true)
    }
  }
  if !found {
    callback(dst, false)
  }
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
    if len(parts) > 1 && name == parts[1] {
      dst := category.convert(a.convert(parts[0], src))
      return dst
    }
  }
  panic(fmt.Sprintf("Cannot convert into %s", name))
}

func (a *almanac) source(name string, dst int) int {
  for categoryName, category := range a.maps {
    parts := strings.Split(categoryName, "-to-")
    if name == categoryName || (len(parts) > 1 && name == parts[1]) {
      src := -1
      category.source(dst, func(s int, f bool) {
        if !f && name == "seed" { return }
        if len(parts) > 1 {
          r := a.source(parts[0], s)
          if r >= 0 { src = r }
        } else {
          src = s
        }
        // fmt.Println(parts[0], s, src)
      })
      return src
    }
  }
  panic(fmt.Sprintf("Cannot get source of %s", name))
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

  for {
    start, err := strconv.Atoi(seeds[0])
    if err != nil { panic(err) }
    size, err := strconv.Atoi(seeds[1])
    if err != nil { panic(err) }

    Almanac.append("seed", start, start, size)

    seeds = seeds[2:]

    if len(seeds) <= 0 { break }
  }

  // seed := Almanac.source("location", 46)
  // fmt.Println(46, seed) // 82

  for location := 0; ; location++ {
    seed := Almanac.source("location", location)
    if location % 1_000_000 == 0 { fmt.Println(location, seed) }
    if seed >= 0 {
      fmt.Println(location, seed)
      break
    }
  }
}
