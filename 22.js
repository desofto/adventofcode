// https://adventofcode.com/2021/day/12

const fs = require('fs')

fs.readFile('./22.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n").filter(line => line.length > 0).map(line => line.split("-"))

  const visited = []
  let count = 0
  step("start")

  function step(cave) {
    if (cave === "end") {
      count++
      console.log(count, [...visited, cave].join("-"))
      return
    }
    if (cave === cave.toLowerCase() && visited.indexOf(cave) >= 0) return
    visited.push(cave)

    input.forEach(([from, to]) => {
      if (from === cave) {
        step(to)
      } else if (to === cave) {
        step(from)
      }
    })

    visited.pop()
  }
})
