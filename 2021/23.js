// https://adventofcode.com/2021/day/12

const fs = require('fs')

fs.readFile('./23.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n").filter(line => line.length > 0).map(line => line.split("-"))

  const visited = []
  let count = 0
  step("start")

  function step(cave) {
    if (cave === "start" && visited.length > 0) return
    if (cave === "end") {
      count++
      console.log(count, [...visited, cave].join("-"))
      return
    }
    if (cave === cave.toLowerCase()) {
      const enters = {}
      visited.forEach(c => {
        if (c !== c.toLowerCase()) return
        enters[c] = enters[c] || 0
        enters[c]++
      })
      if (enters[cave] > 0 && Object.values(enters).some(c => c > 1)) return
    }
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
