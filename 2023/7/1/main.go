package main

import (
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

var labels = "23456789TJQKA"

type hand struct {
  cards []int
  bid int
  power int
}

func (h *hand) calcPower() int {
  cards := make(map[int]int)
  for _, card := range h.cards {
    _, ok := cards[card]
    if ok {
      cards[card]++
    } else {
      cards[card] = 1
    }
  }

  check := func(target int) bool {
    for _, count := range cards {
      if count >= target { return true }
    }

    return false
  }

  if check(5) { return 700 }
  if check(4) { return 600 }
  if check(3) && len(cards) == 2 { return 500 }
  if check(3) { return 400 }
  if check(2) && len(cards) == 3 { return 300 }
  if check(2) { return 200 }
  return 100
}

var hands []hand

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

  for {
    line, _ := getLine()
    if len(line) <= 0 { break }

    items := strings.Split(line, " ")

    cards := []int{}
    for _, card := range strings.Split(items[0], "") {
      cards = append(cards, strings.Index(labels, card))
    }

    bid, err := strconv.Atoi(items[1])
    if err != nil { panic(err) }

    hand := hand{cards, bid, 0}
    hand.power = hand.calcPower()
    hands = append(hands, hand)
  }

  // fmt.Println("Initial order:")
  // for _, hand := range hands {
  //   fmt.Println(hand.cards, hand.power)
  // }

  sort.SliceStable(hands, func(i, j int) bool {
    if hands[i].power < hands[j].power { return true }
    if hands[i].power > hands[j].power { return false }

    for k := 0; k < 5; k++ {
      if hands[i].cards[k] < hands[j].cards[k] { return true }
      if hands[i].cards[k] > hands[j].cards[k] { return false }
    }

    panic("No way")
  })

  total := 0
  // fmt.Println("\nSorted by power:")
  for rank, hand := range hands {
    score := (rank+1) * hand.bid
    total += score
    fmt.Println(hand.cards, hand.power, hand.bid, score)
  }

  fmt.Println(total) // > 247574246 247648334 248217452
}
