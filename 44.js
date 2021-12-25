// https://adventofcode.com/2021/day/24

const fs = require('fs');

fs.readFile('./44.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n").filter(line => line.length > 0).map(line => line.split(' '))

  function execute(number) {
    number = String(number).split('').map(e => parseInt(e))
    const vars = {
      x: 0,
      y: 0,
      w: 0,
      z: 0
    }

    input.forEach(([cmd, v1, v2]) => {
      v2 = Object.keys(vars).indexOf(v2) < 0 ? parseInt(v2) : vars[v2]

      switch (cmd) {
        case 'inp':
          vars[v1] = number.shift()
          break;
        case 'add':
          vars[v1] = vars[v1] + v2
          break;
        case 'mul':
          vars[v1] = vars[v1] * v2
          break;
        case 'div':
          vars[v1] = Math.floor(vars[v1] / v2)
          break;
        case 'mod':
          vars[v1] = vars[v1] % v2
          break;
        case 'eql':
          vars[v1] = vars[v1] === v2 ? 1 : 0
          break;
        default: throw Error();
      }
    });

    return vars.z //=== 0
  }

  function execute2(number) {
    number = number.split('').map(el => parseInt(el))
    let z = 0
    let x, w
    z = 0
    w = number.shift()
    x = (z % 26 + 13) === w
    z = x ? z : z * 26 + w + 14
    console.log(' ', w, x, z, z % 26)

    w = number.shift()
    x = (z % 26 + 12) === w
    z = x ? z : z * 26 + w + 8
    console.log(' ', w, x, z, z % 26)

    w = number.shift()
    x = (z % 26 + 11) === w
    z = x ? z : z * 26 + w + 5
    console.log(' ', w, x, z, z % 26)

    w = number.shift()
    x = (z % 26 + 0) === w
    z = Math.floor(z/26)
    z = x ? z : z * 26 + w + 4
    console.log('!', w, x, z, z % 26)

    w = number.shift()
    x = (z % 26 + 15) === w
    z = x ? z : z * 26 + w + 10
    console.log(' ', w, x, z, z % 26)

    w = number.shift()
    x = (z % 26 - 13) === w
    z = Math.floor(z/26)
    z = x ? z : z * 26 + w + 13
    console.log('!', w, x, z, z % 26)

    w = number.shift()
    x = (z % 26 + 10) === w
    z = x ? z : z * 26 + w + 16
    console.log(' ', w, x, z, z % 26)

    w = number.shift()
    x = (z % 26 - 9) === w
    z = Math.floor(z/26)
    z = x ? z : z * 26 + w + 5
    console.log('!', w, x, z, z % 26)

    w = number.shift()
    x = (z % 26 + 11) === w
    z = x ? z : z * 26 + w + 6
    console.log(' ', w, x, z, z % 26)

    w = number.shift()
    x = (z % 26 + 13) === w
    z = x ? z : z * 26 + w + 13
    console.log(' ', w, x, z, z % 26)

    w = number.shift()
    x = (z % 26 - 14) === w
    z = Math.floor(z/26)
    z = x ? z : z * 26 + w + 6
    console.log('!', w, x, z, z % 26)

    w = number.shift()
    x = (z % 26 - 3) === w
    z = Math.floor(z/26)
    z = x ? z : z * 26 + w + 7
    console.log('!', w, x, z, z % 26)

    w = number.shift()
    x = (z % 26 - 2) === w
    z = Math.floor(z/26)
    z = x ? z : z * 26 + w + 13
    console.log('!', w, x, z, z % 26)

    w = number.shift()
    x = (z % 26 - 14) === w
    z = Math.floor(z/26)
    z = x ? z : z * 26 + w + 3
    console.log('!', w, x, z, z % 26)

    return z
  }

  //let number = '11164118121471'.split('')

  {
    let minResult
    let maxNumber
    let number = '99999999999999'.split('')
    let result = parseInt('11111111111111')
    while (true) {
      let found = false
      for (let i1 = 0; i1 < number.length; i1++) {
        for (let i2 = 0; i2 < number.length; i2++) {
          minResult = null
          maxNumber = [...number]
          for (let d1 = 9; d1 >= 1; d1--) {
            number[i1] = d1
            for (let d2 = 9; d2 >= 1; d2--) {
              number[i2] = d2
              let r = execute(number.join(''))
              if (r === 0) {
                r = parseInt(number.join(''))
                if (r > result) {
                  found = true
                  result = r
                  console.log(result)
                }
              }
              if (!minResult || r < minResult) {
                minResult = r
                maxNumber = [...number]
              }
            }
          }
          number = maxNumber
        }
      }
      if (!found) break
    }
  }

  {
    let minResult
    let minNumber
    let number = '11111111111111'.split('')
    let result = parseInt('99999999999999')
    while (true) {
      let found = false
      for (let i1 = 0; i1 < number.length; i1++) {
        for (let i2 = 0; i2 < number.length; i2++) {
          minResult = null
          minNumber = [...number]
          for (let d1 = 1; d1 <= 9; d1++) {
            number[i1] = d1
            for (let d2 = 1; d2 <= 9; d2++) {
              number[i2] = d2
              let r = execute(number.join(''))
              if (r === 0) {
                r = parseInt(number.join(''))
                if (r < result) {
                  found = true
                  result = r
                  console.log(result)
                }
              }
              if (!minResult || r < minResult) {
                minResult = r
                minNumber = [...number]
              }
            }
          }
          number = minNumber
        }
      }
      if (!found) break
    }
  }
})
