// https://adventofcode.com/2021/day/3

const fs = require('fs')

fs.readFile('./5.txt', 'utf8', (err, data) => {
  if (err) throw err;

  let input = data.split("\n")

  const common = []
  for(let i = 0; i < input.length; i++) {
    const val = input[i].trim()
    for(let j = 0; j < val.length; j++) {
      common[j] = common[j] || 0
      if (val[j] === '1') {
        common[j]++
      } else if (val[j] === '0') {
        common[j]--
      } else {
        throw new Error("Wrong input")
      }
    }
  }
  const gammaRate = common.map(el => el > 0 ? "1" : "0").join("")
  const epsilonRate = common.map(el => el > 0 ? "0" : "1").join("")

  const gammaRateDec = parseInt(gammaRate, 2)
  const epsilonRateDec = parseInt(epsilonRate, 2)
  console.log(gammaRateDec, epsilonRateDec, gammaRateDec*epsilonRateDec);
})
