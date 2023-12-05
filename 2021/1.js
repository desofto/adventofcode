// https://adventofcode.com/2021/day/1

const fs = require('fs')

fs.readFile('./1.txt', 'utf8', (err, data) => {
  if (err) throw err;

  let input = data.split("\n")

  let increases = 0
  let prev = null
  input.forEach(pres => {
    pres = parseFloat(pres)
    if (prev) {
      if (pres > prev) {
        console.log(pres, prev)
        increases++
      }
    }
    prev = pres
  })
  console.log(increases);
  console.log(input.length);
})
