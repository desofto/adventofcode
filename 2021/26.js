// https://adventofcode.com/2021/day/14

const fs = require('fs')

fs.readFile('./26.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n").filter(line => line.length > 0)

  const polymer = input[0].split("")
  const formulas = {}
  input.slice(1).forEach(line => {
    const [from, to] = line.split("->").map(el => el.trim())
    formulas[from] = to
  })

  for(let step = 1; step <= 4; step++) {
    for(let index = 0; index < polymer.length-1; index++) {
      const to = formulas[polymer.slice(index, index+2).join("")]
      if (to) {
        polymer.splice(index+1, 0, to)
        index++
      }
    }
    console.log(step, polymer.join(""))
    const freq = {}
    polymer.forEach(el => {
      freq[el] = freq[el] || 0
      freq[el]++
    })
    const sorted = Object.values(freq).sort((a, b) => a - b)
    console.log(sorted)//[sorted.length-1] - sorted[0])
  }
})
