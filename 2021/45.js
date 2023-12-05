// https://adventofcode.com/2021/day/25

const fs = require('fs');

fs.readFile('./45.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n").filter(line => line.length > 0)

  const map = input.map(line => line.split(''))

  let steps = 0
  while (true) {
    steps++
    let moved = false

    {
      const m = map.map(line => [...line])

      for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
          if (m[y][x] !== '>') continue
          let x1 = (x+1) < m[y].length ? x+1 : 0

          if (m[y][x1] !== '.') continue

          map[y][x1] = map[y][x]
          map[y][x] = '.'

          moved = true
        }
      }
    }

    {
      const m = map.map(line => [...line])

      for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
          if (m[y][x] !== 'v') continue
          let y1 = (y+1) < m.length ? y+1 : 0

          if (m[y1][x] !== '.') continue

          map[y1][x] = map[y][x]
          map[y][x] = '.'

          moved = true
        }
      }
    }

    console.log(steps)
    //console.log(map.map(line => line.join('')).join('\n'))
    //console.log('\n')

    if (!moved) break
  }
})
