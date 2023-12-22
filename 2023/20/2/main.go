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
  receiver *tModule
  sender *tModule
}

type tModule struct {
  name string
  moduleType tModuleType
  receivers []string
  state tState
  memory map[string]tState
}

var modules map[string]*tModule
var queue []tPulse

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

  if m == nil {
    if state == low {
      fmt.Println(buttonPressed)
      panic("rx activated")
    }
    return
  }

  // name := "button"
  // if sender != nil { name = sender.name }
  // fmt.Println(name, "=>", m.name, state)

  queue = append(queue, tPulse{
    state: state,
    receiver: m,
    sender: sender,
  })
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

func (m *tModule) tick(pulse tPulse) {
  state := pulse.state

  switch m.moduleType {
  case broadcaster:
    for _, name := range m.receivers {
      module := modules[name]
      module.push(state, m)
    }
  case flipFlop:
    if state == high { return }
    m.state = invert(m.state)
    for _, name := range m.receivers {
      module := modules[name]
      module.push(m.state, m)
    }
  case conjunction:
    m.memory[pulse.sender.name] = state

    if m.name == "lb" && m.memory["br"] == high && m.memory["fk"] == high {
      fmt.Println("br+fk", buttonPressed - last)
      last = buttonPressed
    }

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
}

func invert(state tState) tState {
  if state == low {
    return high
  } else {
    return low
  }
}

var buttonPressed int
var countLow int
var countHigh int
var last int

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

  for i := 1; i <= 1_000_000_000; i++ {
    if buttonPressed % 100_000 == 0 {
      fmt.Printf("%.1f\n", float64(buttonPressed) / 1_000_000)
    }
    buttonPressed = i
    modules["broadcaster"].push(low, nil)

    for {
      pulse := queue[0]
      queue = queue[1:]
      modules[pulse.receiver.name].tick(pulse)

      if len(queue) <= 0 { break }
    }
  }

  fmt.Println(countLow, countHigh, countLow*countHigh)
}

// > 119498068335546 > 239054742884106

// rz+lf = 15_866_927
// br+fk = 15_814_283
