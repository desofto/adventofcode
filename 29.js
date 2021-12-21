// https://adventofcode.com/2021/day/15

const fs = require('fs')

fs.readFile('./29.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n").filter(line => line.length > 0)

  const map = input.map(line => line.split("").map(el => parseInt(el)))
  const maxY = map.length
  for(let y = 0; y < maxY; y++) {
    const maxX = map[y].length
    for(let x = 0; x < maxX; x++) {
      for(let i = 0; i < 5; i++) {
        for(let j = 0; j < 5; j++) {
          map[maxY * j + y] = map[maxY * j + y] || []
          map[maxY * j + y][maxX * i + x] = 1 + (map[y][x] - 1 + i + j) % 9
        }
      }
    }
  }

  const weights = map.map(line => line.map(el => 0))

  weights[0][0] = map[0][0]

  let changed = true
  while (changed) {
    changed = false
    for(let y = 0; y < weights.length; y++) {
      for(let x = 0; x < weights[y].length; x++) {
        const prev = weights[y][x]
        if (y-1 >= 0) weights[y][x] = minWeight(weights[y][x], weights[y-1][x], map[y][x])
        if (x-1 >= 0) weights[y][x] = minWeight(weights[y][x], weights[y][x-1], map[y][x])
        if (x+1 < weights[y].length) weights[y][x] = minWeight(weights[y][x], weights[y][x+1], map[y][x])
        if (y+1 < weights.length) weights[y][x] = minWeight(weights[y][x], weights[y+1][x], map[y][x])
        if (weights[y][x] !== prev) {
          changed = true
        }
      }
    }
  }

  function minWeight(weight1, weight2, inc) {
    if (weight1) {
      if (weight2) {
        return Math.min(weight1, weight2 + inc)
      } else {
        return weight1
      }
    } else if (weight2) {
      return weight2 + inc
    } else {
      return 0
    }
  }

  console.log(weights[weights.length-1][weights[weights.length-1].length-1] - weights[0][0])
  console.log("\n")
})
