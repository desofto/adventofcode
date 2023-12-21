package main

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

type tStep struct {
  dir string
  length int
  color string
}

type tBlock struct {
  x1, y1 int
  x2, y2 int
  color byte
}

func main() {
  data, err := os.ReadFile("./real.txt")
  if err != nil { panic(err) }
  input := strings.Split(string(data), "\n")

  parser := regexp.MustCompile(`(\w) (\d+) \((\#\w+)\)`)

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

  var steps []tStep
  x := 0
  y := 0
  minX := 0
  minY := 0
  maxX := 0
  maxY := 0

  for {
    line, _ := getLine()
    if len(line) <= 0 { break }

    res := parser.FindAllStringSubmatch(line, -1)[0]
    length, err := strconv.ParseInt(res[3][1:6], 16, 0)
    // length, err := strconv.ParseInt(res[2], 10, 0)
    if err != nil { panic(err) }
    s := tStep{
      dir: res[1],
      length: int(length),
      color: res[3],
    }
    switch res[3][6] {
    case '0':
      s.dir = "R"
    case '1':
      s.dir = "D"
    case '2':
      s.dir = "L"
    case '3':
      s.dir = "U"
    default:
      panic("Wrong direction")
    }
    steps = append(steps, s)

    switch s.dir {
    case "U":
      y -= s.length
    case "D":
      y += s.length
    case "L":
      x -= s.length
    case "R":
      x += s.length
    default:
      panic("Wrong direction")
    }

    minX = min(minX, x)
    maxX = max(maxX, x)

    minY = min(minY, y)
    maxY = max(maxY, y)
  }

  var plan []*tBlock

  plan = append(plan, &tBlock{
    x1: minX,
    y1: minY,
    x2: maxX,
    y2: maxY,
    color: '.',
  })

  x = 0
  y = 0
  for i, s := range steps {
    switch s.dir {
    case "U":
      plan = appendBlock(plan, &tBlock{
        x1: x,
        y1: y-s.length,
        x2: x,
        y2: y,
        color: '#',
      })
      y -= s.length
    case "D":
      plan = appendBlock(plan, &tBlock{
        x1: x,
        y1: y,
        x2: x,
        y2: y+s.length,
        color: '#',
      })
      y += s.length
    case "L":
      plan = appendBlock(plan, &tBlock{
        x1: x-s.length,
        y1: y,
        x2: x,
        y2: y,
        color: '#',
      })
      x -= s.length
    case "R":
      plan = appendBlock(plan, &tBlock{
        x1: x,
        y1: y,
        x2: x+s.length,
        y2: y,
        color: '#',
      })
      x += s.length
    default:
      panic("Wrong direction")
    }
    fmt.Println(i, len(plan))
  }

  fmt.Println(len(plan))

  // for y := minY; y <= maxY; y++ {
  //   s := ""
  //   for x := minX; x <= maxX; x++ {
  //     color := ' '
  //     for i, block := range plan {
  //       if x >= block.x1 && x <= block.x2 && y >= block.y1 && y <= block.y2 {
  //         if color != ' ' { panic(fmt.Sprintf("%d (%d, %d) %c", i, x, y, block.color)) }
  //         color = rune(block.color)
  //       }
  //     }
  //     if color == ' ' { panic(fmt.Sprintf("%d, %d", x, y)) }
  //     s = s + string(color)
  //   }
  //   fmt.Println(s)
  // }
  // fmt.Println()

  // paint(&plan, 1, 1)
  paint(plan, -1, 1)

  // for y := minY; y <= maxY; y++ {
  //   s := ""
  //   for x := minX; x <= maxX; x++ {
  //     color := ' '
  //     for i, block := range plan {
  //       if x >= block.x1 && x <= block.x2 && y >= block.y1 && y <= block.y2 {
  //         if color != ' ' { panic(fmt.Sprintf("%d (%d, %d) %c", i, x, y, block.color)) }
  //         color = rune(block.color)
  //       }
  //     }
  //     if color == ' ' { panic(fmt.Sprintf("%d, %d", x, y)) }
  //     s = s + string(color)
  //   }
  //   fmt.Println(s)
  // }

  sum := 0
  for _, block := range plan {
    if block.color == '#' || block.color == '!' { sum += (block.y2 - block.y1 + 1) * (block.x2 - block.x1 + 1) }
  }
  fmt.Println(sum)
}

func appendBlock(plan []*tBlock, b *tBlock) []*tBlock {
  var newPlan []*tBlock

  found := false
  for _, block := range plan {
    if block.x1 <= b.x2 && block.x2 >= b.x1 && block.y1 <= b.y2 && block.y2 >= b.y1 {
      if b.y1 < block.y1 {
        if b.x1 < block.x1 {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: b.x1,
            y1: b.y1,
            x2: block.x1-1,
            y2: block.y1-1,
            color: b.color,
          })
        }

        // if block.x1 < b.x1 {
        //   newPlan = appendBlock(newPlan, tBlock{
        //     x1: block.x1,
        //     y1: b.y1,
        //     x2: b.x1-1,
        //     y2: block.y1-1,
        //     color: b.color,
        //   })
        // }

        {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: max(block.x1, b.x1),
            y1: b.y1,
            x2: min(b.x2, block.x2),
            y2: block.y1-1,
            color: b.color,
          })
        }

        // if block.x2 > b.x2 {
        //   newPlan = appendBlock(newPlan, tBlock{
        //     x1: b.x2+1,
        //     y1: b.y1,
        //     x2: block.x2,
        //     y2: block.y1-1,
        //     color: b.color,
        //   })
        // }

        if b.x2 > block.x2 {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: block.x2+1,
            y1: b.y1,
            x2: b.x2,
            y2: block.y1-1,
            color: b.color,
          })
        }
      }

      if block.y1 < b.y1 {
        // if b.x1 < block.x1 {
        //   newPlan = appendBlock(newPlan, tBlock{
        //     x1: b.x1,
        //     y1: block.y1,
        //     x2: block.x1-1,
        //     y2: b.y1-1,
        //     color: block.color,
        //   })
        // }

        if block.x1 < b.x1 {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: block.x1,
            y1: block.y1,
            x2: b.x1-1,
            y2: b.y1-1,
            color: block.color,
          })
        }

        {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: max(block.x1, b.x1),
            y1: block.y1,
            x2: min(b.x2, block.x2),
            y2: b.y1-1,
            color: block.color,
          })
        }

        if block.x2 > b.x2 {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: b.x2+1,
            y1: block.y1,
            x2: block.x2,
            y2: b.y1-1,
            color: block.color,
          })
        }

        // if b.x2 > block.x2 {
        //   newPlan = appendBlock(newPlan, tBlock{
        //     x1: block.x2+1,
        //     y1: block.y1,
        //     x2: b.x2,
        //     y2: b.y1-1,
        //     color: block.color,
        //   })
        // }
      }

      {
        if b.x1 < block.x1 {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: b.x1,
            y1: max(b.y1, block.y1),
            x2: block.x1-1,
            y2: min(b.y2, block.y2),
            color: b.color,
          })
        }

        if block.x1 < b.x1 {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: block.x1,
            y1: max(b.y1, block.y1),
            x2: b.x1-1,
            y2: min(b.y2, block.y2),
            color: block.color,
          })
        }

        {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: max(block.x1, b.x1),
            y1: max(b.y1, block.y1),
            x2: min(b.x2, block.x2),
            y2: min(b.y2, block.y2),
            color: b.color,
          })
        }

        if block.x2 > b.x2 {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: b.x2+1,
            y1: max(b.y1, block.y1),
            x2: block.x2,
            y2: min(b.y2, block.y2),
            color: block.color,
          })
        }

        if b.x2 > block.x2 {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: block.x2+1,
            y1: max(b.y1, block.y1),
            x2: b.x2,
            y2: min(b.y2, block.y2),
            color: b.color,
          })
        }
      }

      if block.y2 > b.y2 {
        // if b.x1 < block.x1 {
        //   newPlan = appendBlock(newPlan, tBlock{
        //     x1: b.x1,
        //     y1: b.y2+1,
        //     x2: block.x1-1,
        //     y2: block.y2,
        //     color: block.color,
        //   })
        // }

        if block.x1 < b.x1 {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: block.x1,
            y1: b.y2+1,
            x2: b.x1-1,
            y2: block.y2,
            color: block.color,
          })
        }

        {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: max(block.x1,b.x1),
            y1: b.y2+1,
            x2: min(b.x2, block.x2),
            y2: block.y2,
            color: block.color,
          })
        }

        if block.x2 > b.x2 {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: b.x2+1,
            y1: b.y2+1,
            x2: block.x2,
            y2: block.y2,
            color: block.color,
          })
        }

        // if b.x2 > block.x2 {
        //   newPlan = appendBlock(newPlan, tBlock{
        //     x1: block.x2+1,
        //     y1: b.y2+1,
        //     x2: b.x2,
        //     y2: block.y2,
        //     color: block.color,
        //   })
        // }
      }

      if b.y2 > block.y2 {
        if b.x1 < block.x1 {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: b.x1,
            y1: block.y2+1,
            x2: block.x1-1,
            y2: b.y2,
            color: b.color,
          })
        }

        // if block.x1 < b.x1 {
        //   newPlan = appendBlock(newPlan, tBlock{
        //     x1: block.x1,
        //     y1: block.y2+1,
        //     x2: b.x1-1,
        //     y2: b.y2,
        //     color: b.color,
        //   })
        // }

        {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: max(block.x1, b.x1),
            y1: block.y2+1,
            x2: min(b.x2, block.x2),
            y2: b.y2,
            color: b.color,
          })
        }

        // if block.x2 > b.x2 {
        //   newPlan = appendBlock(newPlan, tBlock{
        //     x1: b.x2+1,
        //     y1: block.y2+1,
        //     x2: block.x2,
        //     y2: b.y2,
        //     color: b.color,
        //   })
        // }

        if b.x2 > block.x2 {
          newPlan = appendBlock(newPlan, &tBlock{
            x1: block.x2+1,
            y1: block.y2+1,
            x2: b.x2,
            y2: b.y2,
            color: b.color,
          })
        }
      }

      found = true
      // break
    // } else if block.x1 <= b.x2 && block.x2 >= b.x1 {
    //   if block.x1 < b.x1 {
    //     newPlan = appendUniq(newPlan, tBlock{
    //       x1: block.x1,
    //       y1: block.y1,
    //       x2: b.x1-1,
    //       y2: block.y2,
    //       color: block.color,
    //     })
    //   }

    //   {
    //     newPlan = appendUniq(newPlan, tBlock{
    //       x1: max(b.x1, block.x1),
    //       y1: block.y1,
    //       x2: min(b.x2, block.x2),
    //       y2: block.y2,
    //       color: block.color,
    //     })
    //   }

    //   if block.x2 > b.x2 {
    //     newPlan = appendUniq(newPlan, tBlock{
    //       x1: b.x2+1,
    //       y1: block.y1,
    //       x2: block.x2,
    //       y2: block.y2,
    //       color: block.color,
    //     })
    //   }
    // } else if block.y1 <= b.y2 && block.y2 >= b.y1 {
    //   if block.y1 < b.y1 {
    //     newPlan = appendUniq(newPlan, tBlock{
    //       x1: block.x1,
    //       y1: block.y1,
    //       x2: block.x2,
    //       y2: b.y1-1,
    //       color: block.color,
    //     })
    //   }

    //   {
    //     newPlan = appendUniq(newPlan, tBlock{
    //       x1: block.x1,
    //       y1: max(b.y1, block.y1),
    //       x2: block.x2,
    //       y2: min(b.y2, block.y2),
    //       color: block.color,
    //     })
    //   }

    //   if block.y2 > b.y2 {
    //     newPlan = appendUniq(newPlan, tBlock{
    //       x1: block.x1,
    //       y1: b.y2+1,
    //       x2: block.x2,
    //       y2: block.y2,
    //       color: block.color,
    //     })
    //   }
    } else {
      newPlan = appendUniq(newPlan, block)
    }
  }

  if !found { newPlan = appendUniq(newPlan, b) }

  return newPlan
}

func appendUniq(plan []*tBlock, block *tBlock) []*tBlock {
  for _, b := range plan {
    if b.x1 == block.x1 && b.y1 == block.y1 && b.x2 == block.x2 && b.y2 == block.y2 && b.color == block.color { return plan }
  }
  return append(plan, block)
}

func paint(plan []*tBlock, x, y int) {
  var sub []*tBlock
  for _, b := range plan {
    if b.color != '#' && b.color != '!' {
      sub = append(sub, b)
    }
  }

  var doPaint func(p []*tBlock, x,y int)

  doPaint = func(p []*tBlock, x,y int) {
    for _, block := range p {
      if x >= block.x1 && x <= block.x2 && y >= block.y1 && y <= block.y2 && block.color != '#' && block.color != '!' {
        block.color = '!'
        var subp []*tBlock
        for _, b := range p {
          if b.color != '#' && b.color != '!' {
            subp = append(subp, b)
          }
        }
        for yy := block.y1; yy <= block.y2; yy++ {
          doPaint(subp, block.x1-1, yy)
          doPaint(subp, block.x2+1, yy)
        }
        for xx := block.x1; xx <= block.x2; xx++ {
          doPaint(subp, xx, block.y1-1)
          doPaint(subp, xx, block.y2+1)
        }
      }
    }
  }

  doPaint(sub, x, y)
}

// > 30215851486481
