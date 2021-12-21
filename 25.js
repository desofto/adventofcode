// https://adventofcode.com/2021/day/13

const fs = require('fs')

fs.readFile('./24.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n")

  let paper = []

  input.forEach(line => {
    if (line.startsWith("fold along y=")) {
      let center = parseInt(line.slice(13))
      for(let y = 1; y <= center; y++) {
        paper[center - y] = paper[center - y] || []
        paper[center + y] = paper[center + y] || []
        const len = Math.max(paper[center + y].length, paper[center - y].length)
        for(let x = 0; x < len; x++) {
          if (paper[center + y][x] === "#") paper[center - y][x] = "#"
        }
      }
      paper = paper.slice(0, center)
      showPaper()
    } else if (line.startsWith("fold along x=")) {
      let center = parseInt(line.slice(13))
      for(let y = 0; y < paper.length; y++) {
        for(let x = 1; x <= center; x++) {
          if (paper[y][center + x] === "#") paper[y][center - x] = "#"
        }
        paper[y] = paper[y].slice(0, center)
      }
      showPaper()
    } else if (line.length > 0) {
      const [x, y] = line.split(",").map(el => parseInt(el))
      paper[y] = paper[y] || []
      paper[y][x] = "#"
      preparePaper()
    }
  })

  function preparePaper() {
    const len = paper.reduce((acc, el) => Math.max(acc, el.length), 0)
    for(let y = 0; y < paper.length; y++) {
      paper[y] = paper[y] || []
      for(let x = 0; x < len; x++) {
        paper[y][x] = paper[y][x] || '.'
      }
    }
  }

  function showPaper() {
    const visible = paper.reduce((acc, line) => acc + line.reduce((acc, el) => el === "#" ? acc + 1 : acc, 0), 0)
    console.log(visible)
    console.log(paper.map(line => line.join("")).join("\n"), "\n")
  }
})
