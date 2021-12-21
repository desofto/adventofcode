const fs = require('fs')

let set = []
fs.readFile('./12.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n")

  const positions = input[0].split(",").map(el => parseInt(el))

  console.log(positions.sort((a,b) => a - b)[Math.round(positions.length / 2)])

  let bestPosition = null
  let bestFuel = null
  for(let i = 0; i <= Math.max(...positions); i++) {
    const fuel = positions.reduce((acc, el) => acc + Math.abs(el - i), 0)
    if (bestPosition === null || fuel < bestFuel) {
      bestPosition = i
      bestFuel = fuel
    }
  }
  console.log(bestPosition, bestFuel)
})
