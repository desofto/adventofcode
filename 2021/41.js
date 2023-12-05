// https://adventofcode.com/2021/day/22

const fs = require('fs');

fs.readFile('./41.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n").filter(line => line.length > 0)

  const cubes = []

  function push(cmd, range) {
    while (true) {
      let changed = false
      for (let index = 0; index < cubes.length; index++) {
        const r = cubes[index]
        if (
          range[0][1] >= r[0][0] && range[0][0] <= r[0][1] &&
          range[1][1] >= r[1][0] && range[1][0] <= r[1][1] &&
          range[2][1] >= r[2][0] && range[2][0] <= r[2][1]
        ) {
          // split cube to smaller
          cubes.splice(index, 1)
          changed = true
          if (range[0][0] > r[0][0]) {
            cubes.push([
              [r[0][0], range[0][0]-1],
              [r[1][0], r[1][1]],
              [r[2][0], r[2][1]],
            ])
          }
          if (range[0][1] < r[0][1]) {
            cubes.push([
              [range[0][1]+1, r[0][1]],
              [r[1][0], r[1][1]],
              [r[2][0], r[2][1]],
            ])
          }
          if (range[1][0] > r[1][0]) {
            cubes.push([
              [Math.max(range[0][0], r[0][0]), Math.min(range[0][1], r[0][1])],
              [r[1][0], range[1][0]-1],
              [r[2][0], r[2][1]],
            ])
          }
          if (range[1][1] < r[1][1]) {
            cubes.push([
              [Math.max(range[0][0], r[0][0]), Math.min(range[0][1], r[0][1])],
              [range[1][1]+1, r[1][1]],
              [r[2][0], r[2][1]],
            ])
          }
          if (range[2][0] > r[2][0]) {
            cubes.push([
              [Math.max(range[0][0], r[0][0]), Math.min(range[0][1], r[0][1])],
              [Math.max(range[1][0], r[1][0]), Math.min(range[1][1], r[1][1])],
              [r[2][0], range[2][0]-1],
            ])
          }
          if (range[2][1] < r[2][1]) {
            cubes.push([
              [Math.max(range[0][0], r[0][0]), Math.min(range[0][1], r[0][1])],
              [Math.max(range[1][0], r[1][0]), Math.min(range[1][1], r[1][1])],
              [range[2][1]+1, r[2][1]],
            ])
          }
          break
        }
      }
      if (!changed) break
    }
    if (cmd === 'on') {
      cubes.push([
        [range[0][0], range[0][1]],
        [range[1][0], range[1][1]],
        [range[2][0], range[2][1]],
      ])
    }
  }

  /*
  push(
    'on',
    [
      [0, 4],
      [0, 4],
      [0, 4]
    ]
  )

  push(
    'on',
    [
      [1, 5],
      [1, 5],
      [1, 5]
    ]
  )

  push(
    'off',
    [
      [2, 2],
      [2, 2],
      [2, 2]
    ]
  )

  console.log(cubes)
  console.log(
    cubes.reduce((acc, r) => acc + (r[0][1] - r[0][0] + 1) * (r[1][1] - r[1][0] + 1) * (r[2][1] - r[2][0] + 1), 0)
  )

  return
  */

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

    push(cmd, ranges)
    console.log(cmd, ranges, cubes.length)
  })

  console.log(
    cubes.reduce((acc, r) => acc + (r[0][1] - r[0][0] + 1) * (r[1][1] - r[1][0] + 1) * (r[2][1] - r[2][0] + 1), 0)
  )
})
