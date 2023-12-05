// https://adventofcode.com/2021/day/11

const fs = require('fs')

fs.readFile('./20.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n")

  const octopuses = input.filter(line => line).map(line => line.split("").map(el => parseInt(el)))

  let flashes = 0

  for(let step = 1; step <= 1000; step++) {
    for(let y = 0; y < octopuses.length; y++) {
      for(let x = 0; x < octopuses[y].length; x++) {
        increase(y, x)
      }
    }

    for(let y = 0; y < octopuses.length; y++) {
      for(let x = 0; x < octopuses[y].length; x++) {
        if (octopuses[y][x] > 9) octopuses[y][x] = 0
      }
    }

    console.log(step, flashes)
    console.log(octopuses.map(line => line.join("")).join("\n"))
    if (octopuses.reduce((acc, line) => acc + line.reduce((acc, el) => acc + el, 0), 0) === 0) break
  }

  function increase(y, x) {
    if (y < 0) return
    if (x < 0) return
    if (y >= octopuses.length) return
    if (x >= octopuses[y].length) return

    octopuses[y][x]++
    if (octopuses[y][x] === 10) flash(y, x)
  }

  function flash(y, x) {
    flashes++
    increase(y-1, x-1)
    increase(y-1, x)
    increase(y-1, x+1)
    increase(y, x-1)
    increase(y, x+1)
    increase(y+1, x-1)
    increase(y+1, x)
    increase(y+1, x+1)
  }
})
