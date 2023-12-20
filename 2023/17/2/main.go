package main

import (
	"fmt"
	"os"
	"strings"
)

const (
  right = 0
  down = 1
  left = 2
  up = 3
)

type tCell struct {
  loss int
  lost [4][11]int
}

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  lines := strings.Split(string(data), "\n")

  var input [][]tCell
  for _, line := range lines {
    if len(line) > 0 {
      var s []tCell
      for x := 0; x < len(line); x++ {
        s = append(s, tCell{
          loss: int(line[x]) - '0',
          lost: [4][11]int{},
        })
      }
      input = append(input, s)
    }
  }
  input[0][0].lost[left][1] = 1

  for {
    changed := false

    for y := 0; y < len(input); y++ {
      for x := 0; x < len(input[y]); x++ {
        for dir := right; dir <= up; dir++ {
          for cnt1 := 1; cnt1 <= 10; cnt1++ {
            lost := input[y][x].lost[dir][cnt1]
            if lost > 0 {
              if dir != left && dir != right {
                {
                  new := lost
                  for cnt2 := 1; cnt2 <= 10 && x + cnt2 <= len(input[y])-1; cnt2++ {
                    new += input[y][x+cnt2].loss
                    if cnt2 >= 4 {
                      old := input[y][x+cnt2].lost[right][cnt2]
                      if old <= 0 || new < old {
                        input[y][x+cnt2].lost[right][cnt2] = new
                        changed = true
                      }
                    }
                  }
                }

                {
                  new := lost
                  for cnt2 := 1; cnt2 <= 10 && x - cnt2 >= 0; cnt2++ {
                    new += input[y][x-cnt2].loss
                    if cnt2 >= 4 {
                      old := input[y][x-cnt2].lost[left][cnt2]
                      if old <= 0 || new < old {
                        input[y][x-cnt2].lost[left][cnt2] = new
                        changed = true
                      }
                    }
                  }
                }
              }

              if dir != up && dir != down {
                {
                  new := lost
                  for cnt2 := 1; cnt2 <= 10 && y + cnt2 <= len(input)-1; cnt2++ {
                    new += input[y+cnt2][x].loss
                    if cnt2 >= 4 {
                      old := input[y+cnt2][x].lost[down][cnt2]
                      if old <= 0 || new < old {
                        input[y+cnt2][x].lost[down][cnt2] = new
                        changed = true
                      }
                    }
                  }
                }

                {
                  new := lost
                  for cnt2 := 1; cnt2 <= 10 && y - cnt2 >= 0; cnt2++ {
                    new += input[y-cnt2][x].loss
                    if cnt2 >= 4 {
                      old := input[y-cnt2][x].lost[up][cnt2]
                      if old <= 0 || new < old {
                        input[y-cnt2][x].lost[up][cnt2] = new
                        changed = true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    if !changed { break }
  }

  for y := 0; y < len(input); y++ {
    s := ""
    for x := 0; x < len(input[y]); x++ {
      m := -1
      for _, s1 := range input[y][x].lost {
        for _, s2 := range s1 {
          if s2 > 0 && (m <= 0 || s2 < m) {
            m = s2
          }
        }
      }
      s = s + fmt.Sprintf("%5d", m-1)
    }
    fmt.Println(s)
  }

  // fmt.Println(input[len(input)-1][len(input[len(input)-1])-1])
}
