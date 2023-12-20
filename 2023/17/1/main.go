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
  lost [4][4][4]int
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
          lost: [4][4][4]int{},
        })
      }
      input = append(input, s)
    }
  }
  input[0][0].lost[up][up][up] = 1

  for {
    changed := false

    for y := 0; y < len(input); y++ {
      for x := 0; x < len(input[y]); x++ {
        for dir1 := right; dir1 <= up; dir1++ {
          for dir2 := right; dir2 <= up; dir2++ {
            for dir3 := right; dir3 <= up; dir3++ {
              if input[y][x].lost[dir1][dir2][dir3] > 0 {
                if dir3 != left && x < len(input[y])-1 && (dir3 != right || dir2 != right || dir1 != right) {
                  old := input[y][x+1].lost[dir2][dir3][right]
                  new := input[y][x].lost[dir1][dir2][dir3] + input[y][x+1].loss
                  if old <= 0 || new < old {
                    input[y][x+1].lost[dir2][dir3][right] = new
                    changed = true
                  }
                }

                if dir3 != up && y < len(input)-1 && (dir3 != down || dir2 != down || dir1 != down) {
                  old := input[y+1][x].lost[dir2][dir3][down]
                  new := input[y][x].lost[dir1][dir2][dir3] + input[y+1][x].loss
                  if old <= 0 || new < old {
                    input[y+1][x].lost[dir2][dir3][down] = new
                    changed = true
                  }
                }

                if dir3 != right && x > 0 && (dir3 != left || dir2 != left || dir1 != left) {
                  old := input[y][x-1].lost[dir2][dir3][left]
                  new := input[y][x].lost[dir1][dir2][dir3] + input[y][x-1].loss
                  if old <= 0 || new < old {
                    input[y][x-1].lost[dir2][dir3][left] = new
                    changed = true
                  }
                }

                if dir3 != down && y > 0 && (dir3 != up || dir2 != up || dir1 != up) {
                  old := input[y-1][x].lost[dir2][dir3][up]
                  new := input[y][x].lost[dir1][dir2][dir3] + input[y-1][x].loss
                  if old <= 0 || new < old {
                    input[y-1][x].lost[dir2][dir3][up] = new
                    changed = true
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
          for _, s3 := range s2 {
            if s3 > 0 && (m < 0 || s3 < m) {
              m = s3
            }
          }
        }
      }
      s = s + fmt.Sprintf("%5d", m-1)
    }
    fmt.Println(s)
  }

  fmt.Println(input[len(input)-1][len(input[len(input)-1])-1])
}
