// https://adventofcode.com/2021/day/8

const fs = require('fs')

fs.readFile('./14.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n")

  let count = 0

  input.forEach(line => {
    if (line.length < 1) return true

    const [train, test] = line.split("|").map(el => el.trim())

    test.split(" ").forEach(el => {
      if ([2, 3, 4, 7].indexOf(el.length) >= 0) {
        count++
      }
    })
  })

  console.log(count)
})
