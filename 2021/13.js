// https://adventofcode.com/2021/day/7

const fs = require('fs')

let set = []
fs.readFile('./13.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n")

  const positions = input[0].split(",").map(el => parseInt(el))

  let bestPosition = null
  let bestFuel = null
  for(let i = 0; i <= Math.max(...positions); i++) {
    const fuelSum = positions.reduce((acc, el) => acc + fuel(Math.abs(el - i)), 0)
    if (bestPosition === null || fuelSum < bestFuel) {
      bestPosition = i
      bestFuel = fuelSum
    }
  }
  console.log(bestPosition, bestFuel)
})

function fuel(i) {
  if (i < 1) return 0

  return i + fuel(i-1)
}
