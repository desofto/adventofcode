// https://adventofcode.com/2021/day/5

const fs = require('fs')

let set = []
fs.readFile('./9.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n")

  const field = []
  input.forEach(line => {
    if (line.length < 1) return
    const [from, to] = line.split("->")
    let [x1, y1] = from.trim().split(",").map(el => parseInt(el))
    let [x2, y2] = to.trim().split(",").map(el => parseInt(el))

    if (x1 === x2) {
      do {
        field[y1] = field[y1] || []
        field[y1][x1] = field[y1][x1] || 0
        field[y1][x1]++
        if (y1 < y2) {
          y1++
        } else if (y1 > y2) {
          y1--
        } else {
          break
        }
      } while (true)
    } else if (y1 === y2) {
      do {
        field[y1] = field[y1] || []
        field[y1][x1] = field[y1][x1] || 0
        field[y1][x1]++
        if (x1 < x2) {
          x1++
        } else if (x1 > x2) {
          x1--
        } else break
      } while (true)
    }
  })

  let count = 0
  field.forEach(row => {
    row.forEach(cell => {
      if (cell > 1) count++
    })
  })

  console.log(field)
  console.log(count)
})
