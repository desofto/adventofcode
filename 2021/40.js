// https://adventofcode.com/2021/day/22

const fs = require('fs');

fs.readFile('./40.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n").filter(line => line.length > 0)

  const cubes = []

  input.forEach(line => {
    const [cmd, coords] = line.split(' ')
    const ranges = []
    coords.split(',').forEach(val => {
      const [coord, values] = val.split('=')
      const range = values.split('..').map(el => parseInt(el))
      if (coord === 'x') ranges[0] = range
      if (coord === 'y') ranges[1] = range
      if (coord === 'z') ranges[2] = range
    })

    for (let x = Math.max(-50, ranges[0][0]); x <= Math.min(50, ranges[0][1]); x++) {
      for (let y = Math.max(-50, ranges[1][0]); y <= Math.min(50, ranges[1][1]); y++) {
        for (let z = Math.max(-50, ranges[2][0]); z <= Math.min(50, ranges[2][1]); z++) {
          cubes[z] = cubes[z] || []
          cubes[z][y] = cubes[z][y] || []
          cubes[z][y][x] = cmd === 'on' ? 1 : 0
        }
      }
    }
    console.log(cmd, ranges)
  })
  console.log(
    Object.values(cubes).reduce((acc, line) => {
      return acc + Object.values(line).reduce((acc, line) => {
        return acc + Object.values(line).reduce((acc, el) => {
          return acc + (el || 0)
        }, 0)
      }, 0)
    }, 0)
  )
})
