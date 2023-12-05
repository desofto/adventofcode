// https://adventofcode.com/2021/day/1

const fs = require('fs')

fs.readFile('./2.txt', 'utf8', (err, data) => {
  if (err) throw err;

  let input = data.split("\n")

  let increases = 0
  let prev = null
  for(let i = 1; i < input.length-1; i++) {
    let pres = parseFloat(input[i-1]) + parseFloat(input[i]) + parseFloat(input[i+1])
    if (prev) {
      if (pres > prev) {
        increases++
      }
    }
    prev = pres
  }
  console.log(increases);
})
