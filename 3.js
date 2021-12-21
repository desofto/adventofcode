// https://adventofcode.com/2021/day/2

const fs = require('fs')

fs.readFile('./3.txt', 'utf8', (err, data) => {
  if (err) throw err;

  let input = data.split("\n")

  let position = 0
  let depth = 0
  for(let i = 0; i < input.length; i++) {
    const [command, value] = input[i].trim().split(" ")
    switch (command) {
      case "forward":
        position += parseInt(value)
        break
      case "up":
        depth -= parseInt(value)
        break
      case "down":
        depth += parseInt(value)
        break
      default:
        console.log("Wrong command", command)
        break
    }
  }
  console.log(position, depth, position * depth);
})
