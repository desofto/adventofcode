// https://adventofcode.com/2021/day/10

const fs = require('fs')

fs.readFile('./19.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n")
  const scores = input.map(line => {
    const score = isCorrectLine(line)
    if (score < 0) return -score
  }).filter(score => score).sort((a, b) => b - a)
  console.log(scores[Math.floor(scores.length / 2)])
})

function isCorrectLine(line) {
  const pool = []
  for(let i = 0; i < line.length; i++) {
    const ch = line[i]
    const index = '([{<'.indexOf(ch)
    if (index >= 0) {
      pool.unshift(')]}>'[index])
    } else if (')]}>'.indexOf(ch) >= 0) {
      const score = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137
      }
      const expected = pool.shift()
      if (expected !== ch) {
        return score[ch]
      }
    }
  }
  const score = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
  }
  console.log(pool.join(""), pool.reduce((acc, el) => acc * 5 + score[el], 0))
  return -pool.reduce((acc, el) => acc * 5 + score[el], 0)
}
