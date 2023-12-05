// https://adventofcode.com/2021/day/10

const fs = require('fs')

fs.readFile('./18.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n")
  console.log(input.reduce((acc, line) => acc + isCorrectLine(line), 0))
})

function isCorrectLine(line) {
  const pool = []
  for(let i = 0; i < line.length; i++) {
    const ch = line[i]
    const index = '([{<'.indexOf(ch)
    if (index >= 0) {
      pool.push(')]}>'[index])
    } else if (')]}>'.indexOf(ch) >= 0) {
      const score = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137
      }
      const expected = pool.pop()
      if (expected !== ch) {
        console.log(ch)
        return score[ch]
      }
    }
  }
  return 0
}
