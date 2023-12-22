package main

import (
	"fmt"
	"os"
	"slices"
	"strings"
)

type tModuleType int

const (
  broadcaster tModuleType = iota
  flipFlop tModuleType = iota
  conjunction tModuleType = iota
)

type tState int

const (
  low tState = iota
  high tState = iota
)

type tPulse struct {
  state tState
  sender *tModule
}

type tModule struct {
  name string
  input []tPulse
  moduleType tModuleType
  receivers []string
  state tState
  memory map[string]tState
}

var modules map[string]*tModule

func newModule(name string, moduleType tModuleType, receivers []string) {
  modules[name] = &tModule{
    name: name,
    moduleType: moduleType,
    receivers: receivers,
    memory: make(map[string]tState),
  }
}

func (m *tModule) push(state tState, sender *tModule) {
  if state == low { countLow++ }
  if state == high { countHigh++ }

  if m == nil { return }

  name := "button"
  if sender != nil { name = sender.name }
  fmt.Println(name, "=>", m.name, state)

  m.input = append([]tPulse{{
    state: state,
    sender: sender,
  }}, m.input...)
}

func (m *tModule) pop() (tState, *tModule) {
  pulse := m.input[0]
  m.input = m.input[1:]

  return pulse.state, pulse.sender
}

func (m *tModule) init() {
  switch m.moduleType {
  case broadcaster:
  case flipFlop:
  case conjunction:
    for _, module := range modules {
      if slices.Contains(module.receivers, m.name) {
        m.memory[module.name] = low
      }
    }
  default:
    panic("Wrong module type")
  }
}

func (m *tModule) tick() bool {
  if len(m.input) <= 0 { return false }

  state, sender := m.pop()

  switch m.moduleType {
  case broadcaster:
    for _, name := range m.receivers {
      module := modules[name]
      module.push(state, m)
    }
  case flipFlop:
    if state == high { return false }
    m.state = invert(m.state)
    for _, name := range m.receivers {
      module := modules[name]
      module.push(m.state, m)
    }
  case conjunction:
    m.memory[sender.name] = state

    state = low
    for _, s := range m.memory {
      if s != high {
        state = high
        break
      }
    }
    for _, name := range m.receivers {
      module := modules[name]
      module.push(state, m)
    }
  default:
    panic("Wrong module type")
  }

  return true
}

func invert(state tState) tState {
  if state == low {
    return high
  } else {
    return low
  }
}

var countLow int
var countHigh int

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

  modules = make(map[string]*tModule)
  for {
    line, _ := getLine()
    if len(line) <= 0 { break }

    l := strings.Split(line, "->")

    var receivers []string

    for _, r := range strings.Split(l[1], ",") {
      receivers = append(receivers, strings.Trim(r, " "))
    }

    if l[0][0] == '%' {
      newModule(strings.Trim(l[0][1:], " "), flipFlop, receivers)
    } else if l[0][0] == '&' {
      newModule(strings.Trim(l[0][1:], " "), conjunction, receivers)
    } else {
      newModule(strings.Trim(l[0], " "), broadcaster, receivers)
    }
  }

  // newModule("broadcaster", broadcaster, []string{"a", "b", "c"})
  // newModule("a", flipFlop, []string{"b"})
  // newModule("b", flipFlop, []string{"c"})
  // newModule("c", flipFlop, []string{"inv"})
  // newModule("inv", conjunction, []string{"a"})

  // newModule("broadcaster", broadcaster, []string{"a"})
  // newModule("a", flipFlop, []string{"inv", "con"})
  // newModule("inv", conjunction, []string{"b"})
  // newModule("b", flipFlop, []string{"con"})
  // newModule("con", conjunction, []string{"output"})
  // newModule("output", broadcaster, []string{})

  for _, m := range modules {
    m.init()
  }

  countLow = 0
  countHigh = 0

  for i := 1; i <= 1000; i++ {
    modules["broadcaster"].push(low, nil)

    for {
      done := true

      for _, m := range modules {
        if m.tick() {
          done = false
        }
      }

      if done { break }
    }
  }

  fmt.Println(countLow, countHigh, countLow*countHigh)
}
