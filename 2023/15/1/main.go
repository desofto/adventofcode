package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  lines := strings.Split(string(data), "\n")

  // fmt.Println(hash("HASH"))

  fmt.Println(lines[0])

  sum := 0

  for _, str := range strings.Split(lines[0], ",") {
    sum += hash(str)
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
