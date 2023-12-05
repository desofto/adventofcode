// https://adventofcode.com/2021/day/14

const fs = require('fs')

fs.readFile('./27.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n").filter(line => line.length > 0)

  const polymer = {}
  for(let i = 0; i < input[0].length-1; i++) {
    const pair = input[0].slice(i, i+2)
    polymer[pair] = polymer[pair] || 0
    polymer[pair]++
  }

  const counter = {}
  for(let i = 0; i < input[0].length; i++) {
    const el = input[0][i]
    counter[el] = counter[el] || 0
    counter[el]++
  }

  const formulas = {}
  input.slice(1).forEach(line => {
    const [from, to] = line.split("->").map(el => el.trim())
    formulas[from] = to
  })

  for(let step = 1; step <= 40; step++) {
    Object.entries(polymer).forEach(([pair, count]) => {
      if (count <= 0) return

      const res = formulas[pair]
      if (res) {
        polymer[pair[0] + res] = polymer[pair[0] + res] || 0
        polymer[pair[0] + res] = polymer[pair[0] + res] + count
        polymer[res + pair[1]] = polymer[res + pair[1]] || 0
        polymer[res + pair[1]] = polymer[res + pair[1]] + count
        counter[res] = counter[res] || 0
        counter[res] = counter[res] + count
        polymer[pair] = polymer[pair] - count
        console.log(step, pair, res, polymer)
      }
    })
    const sorted = Object.values(counter).sort((a,b) => a - b)
    console.log(sorted[sorted.length-1] - sorted[0])
  }
})
