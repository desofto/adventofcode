// https://adventofcode.com/2021/day/9

const fs = require('fs')

fs.readFile('./16.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n")

  const array = input.filter(line => line.length > 0).map(line => line.split("").map(el => parseInt(el)))

  let sum = 0
  for(let y = 0; y < array.length; y++) {
    for(let x = 0; x < array[y].length; x++) {
      const h = array[y][x]
      let isMin = true
      if (isMin && x - 1 >= 0 && array[y][x-1] <= h) isMin = false
      if (isMin && y - 1 >= 0 && array[y-1][x] <= h) isMin = false
      if (isMin && x + 1 < array[y].length && array[y][x+1] <= h) isMin = false
      if (isMin && y + 1 < array.length && array[y+1][x] <= h) isMin = false

      if (isMin) sum += 1 + h
    }
  }
  console.log(sum)

  /*
  function height(x, y) {
    let result = array[y][x]
    if (x - 1 >= 0) result = Math.min(result, array[y][x-1])
    if (y - 1 >= 0) result = Math.min(result, array[y-1][x])
    if (x + 1 < array[y].length) result = Math.min(result, array[y][x+1])
    if (y + 1 < array.length) result = Math.min(result, array[y+1][x])
    return result
  }
  */
})
