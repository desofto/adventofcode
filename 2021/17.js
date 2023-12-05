// https://adventofcode.com/2021/day/9

const fs = require('fs')

fs.readFile('./17.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n")

  const array = input.filter(line => line.length > 0).map(line => line.split("").map(el => parseInt(el)))
  const basins = array.map(line => line.map(_ => 0))

  let basinsId = 0

  while (true) {
    let changed = true
    while (changed) {
      changed = false
      for(let y = 0; y < array.length; y++) {
        for(let x = 0; x < array[y].length; x++) {
          if (basins[y][x]) continue
          if (array[y][x] === 9) continue
          let id = basins[y][x]
          if (!id && x - 1 >= 0) id = basins[y][x-1]
          if (!id && y - 1 >= 0) id = basins[y-1][x]
          if (!id && x + 1 < array[y].length) id = basins[y][x+1]
          if (!id && y + 1 < array.length) id = basins[y+1][x]
          if (id) {
            basins[y][x] = id
            changed = true
          }
        }
      }
    }

    changed = false
    for(let y = 0; y < array.length && !changed; y++) {
      for(let x = 0; x < array[y].length && !changed; x++) {
        if (basins[y][x]) continue
        if (array[y][x] === 9) continue

        basins[y][x] = ++basinsId
        changed = true
      }
    }

    if (!changed) break
  }

  const sizes = []
  for(let y = 0; y < array.length; y++) {
    for(let x = 0; x < array[y].length; x++) {
      const id = basins[y][x]
      if (!id) continue
      sizes[id] = sizes[id] || 0
      sizes[id]++
    }
  }

  console.log(basinsId)

  console.log(basins.map(line => line.map(el => el ? el : 0).join("")).join("\n"))
  console.log(sizes.sort((a,b) => b - a))
  console.log(sizes.sort((a,b) => b - a).slice(0, 3).reduce((acc, el) => acc * el, 1))
})
