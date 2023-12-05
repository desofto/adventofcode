// https://adventofcode.com/2021/day/16

const fs = require('fs')

fs.readFile('./30.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n").filter(line => line.length > 0)

  const code = input[0].split("").map(el => {
    let s = parseInt(el, 16).toString(2)
    while (s.length < 4) s = '0' + s
    return s
  }).join("").split("")

  let sum = 0
  parsePackage(code)
  console.log(sum)

  function parsePackage(code, level = 0) {
    console.log(level, code.join(""))
    const V = parseInt(code.splice(0, 3).join(""), 2)
    const T = parseInt(code.splice(0, 3).join(""), 2)
    sum += V

    if (T === 4) {
      const pkg = []
      while (true) {
        const cont = parseInt(code.splice(0, 1))
        const ch = code.splice(0, 4)
        pkg.push(parseInt(ch.join(""), 2).toString(16))
        if (!cont) break
      }
      console.log("L", V, T, parseInt(pkg.join(""), 16))
    } else {
      const lenType = parseInt(code.splice(0, 1))

      if (lenType) {
        let count = parseInt(code.splice(0, 11).join(""), 2)
        console.log("O", V, T, 1, count)
        while (count > 0) {
          parsePackage(code, level + 1)
          count--
        }
      } else {
        const len = parseInt(code.splice(0, 15).join(""), 2)
        console.log("O", V, T, 0, len)
        const subCode = code.splice(0, len)
        while (subCode.length > 0) {
          parsePackage(subCode, level + 1)
        }
      }
    }

    if (level === 0) {
      code.splice(0, code.length % 4)
    }
  }
})
