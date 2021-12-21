// https://adventofcode.com/2021/day/18

const fs = require('fs')

fs.readFile('./34.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n").filter(line => line.length > 0)

  /*
  let number = null

  while (input.length > 0) {
    number = add(number, parse(input.shift()))
    //console.log(number.join(""))
    number = reduce(number)
    //console.log(number.join(""))
  }

  console.log(magnitude(number))
  */

  const numbers = input.map(n => parse(n))

  let max = 0
  for(let i = 0; i < numbers.length; i++) {
    for(let j = 0; j < numbers.length; j++) {
      if (i !== j) {
        const m = magnitude(reduce(add(numbers[i], numbers[j])))
        if (m > max) {
          max = m
          console.log(max, i, j)
        }
      }
    }
  }

  function magnitude(n) {
    const res = []

    for(let i = 0; i < n.length; i++) {
      if (n[i] === '[') {

      } else if (n[i] === ',') {

      } else if (n[i] === ']') {
        const n2 = res.pop()
        const n1 = res.pop()
        res.push(n1 * 3 + n2 * 2)
      } else {
        res.push(n[i])
      }
    }
    return res.pop()
  }

  function parse(n) {
    const res = []

    const digits = []
    for(let i = 0; i < n.length; i++) {
      if (n[i] >= '0' && n[i] <= '9') {
        digits.push(n[i])
      } else {
        if (digits.length > 0) {
          res.push(parseInt(digits.splice(0).join("")))
        }
        res.push(n[i])
      }
    }

    if (digits.length > 0) {
      res.push(parseInt(digits.splice(0).join("")))
    }

    return res
  }

  function add(n1, n2) {
    if (!n1) return n2
    return ['[', ...n1, ',', ...n2, ']']
  }

  function reduce(n) {
    while (true) {
      //console.log(n.join(""))
      let saved = n.length
      n = explode(n)
      if (n.length !== saved) continue
      n = split(n)
      if (n.length !== saved) continue
      break
    }
    return n
  }

  function explode(n) {
    const pos = []
    for(let i = 0; i < n.length; i++) {
      if (n[i] === '[') {
        pos.push(i)
      } else if (n[i] === ']') {
        if (pos.length > 4) {
          const b = pos.pop()
          const [n1, _, n2] = n.slice(b+1, i)
          n.splice(b, 5, 0)
          for(let j = b-1; j >= 0; j--) {
            if (n[j] === parseInt(n[j])) {
              n[j] += n1
              break
            }
          }
          for(let j = i-3; j < n.length; j++) {
            if (n[j] === parseInt(n[j])) {
              n[j] += n2
              break
            }
          }
          break
        } else {
          pos.pop()
        }
      }
    }
    return n
  }

  function split(n) {
    for(let i = 0; i < n.length; i++) {
      if (n[i] === parseInt(n[i])) {
        if (n[i] >= 10) {
          const n1 = Math.floor(n[i] / 2)
          const n2 = Math.ceil(n[i] / 2)
          n.splice(i, 1, '[', n1, ',', n2, ']')
          break
        }
      }
    }
    return n
  }
})
