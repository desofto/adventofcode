// https://adventofcode.com/2021/day/16

const fs = require('fs')

fs.readFile('./31.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n").filter(line => line.length > 0)

  const code = input[0].split("").map(el => {
    let s = parseInt(el, 16).toString(2)
    while (s.length < 4) s = '0' + s
    return s
  }).join("").split("")

  console.log(parsePackage(code))

  function parsePackage(code, level = 0) {
    let result

    const V = parseInt(code.splice(0, 3).join(""), 2)
    const T = parseInt(code.splice(0, 3).join(""), 2)

    if (T === 4) {
      const pkg = []
      while (true) {
        const cont = parseInt(code.splice(0, 1))
        const ch = code.splice(0, 4)
        pkg.push(parseInt(ch.join(""), 2).toString(16))
        if (!cont) break
      }

      result = parseInt(pkg.join(""), 16)
    } else {
      let pkg = []

      const lenType = parseInt(code.splice(0, 1))

      if (lenType) {
        let count = parseInt(code.splice(0, 11).join(""), 2)
        while (count > 0) {
          pkg.push(parsePackage(code, level + 1))
          count--
        }
      } else {
        const len = parseInt(code.splice(0, 15).join(""), 2)
        const subCode = code.splice(0, len)
        while (subCode.length > 0) {
          pkg.push(parsePackage(subCode, level + 1))
        }
      }

      switch (T) {
        case 0:
          result = pkg.reduce((acc, el) => acc + el, 0)
          break
        case 1:
          result = pkg.reduce((acc, el) => acc * el, 1)
          break
        case 2:
          result = Math.min(...pkg)
          break
        case 3:
          result = Math.max(...pkg)
          break
        case 5:
          result = pkg[0] > pkg[1] ? 1 : 0
          break
        case 6:
          result = pkg[0] < pkg[1] ? 1 : 0
          break
        case 7:
          result = pkg[0] === pkg[1] ? 1 : 0
          break
        }
    }

    if (level === 0) {
      code.splice(0, code.length % 4)
    }

    return result
  }
})
