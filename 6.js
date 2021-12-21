// https://adventofcode.com/2021/day/3

const fs = require('fs')

fs.readFile('./6.txt', 'utf8', (err, data) => {
  if (err) throw err;

  let input = data.split("\n")

  function find(invert = false) {
    let rest = input
    let index = 0
    while (rest.length > 1) {
      let common = 0
      for(let i = 0; i < rest.length; i++) {
        const val = rest[i].trim()
        if (val.length < 1) break
        if (val[index] === '1') {
          common++
        } else if (val[index] === '0') {
          common--
        } else {
          throw new Error(`Wrong input #${index} "${val}"`)
        }
      }
      if (invert) {
        common = common >= 0 ? "0" : "1"
      } else {
        common = common >= 0 ? "1" : "0"
      }

      rest = rest.filter(val => val[index] === common)

      index++
    }

    return rest[0]
  }

  const oxygenRate = find(false)
  const oxygenRateDec = parseInt(oxygenRate, 2)
  console.log(oxygenRate, oxygenRateDec)

  const CO2Rate = find(true)
  const CO2RateDec = parseInt(CO2Rate, 2)
  console.log(CO2Rate, CO2RateDec)

  console.log(oxygenRateDec*CO2RateDec)
})
