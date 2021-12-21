// https://adventofcode.com/2021/day/6

const fs = require('fs')

let set = []
fs.readFile('./11.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n")

  const counters = []
  input[0]
    .split(",")
    .map(el => parseInt(el))
    .forEach(count => counters[count] = (counters[count] || 0) + 1)

  for(let i = 0; i < 256; i++) {
    let a = counters.shift() || 0
    counters[6] = (counters[6] || 0) + a
    counters[8] = (counters[8] || 0) + a
  }

  console.log(sum(counters))
})

function sum(counters) {
  return counters.reduce((sum, count) => sum + (count || 0), 0)
}
