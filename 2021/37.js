// https://adventofcode.com/2021/day/20

const fs = require('fs');

fs.readFile('./37.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n").filter(line => line.length > 0)

  const algorithm = input[0]
  let image = input.slice(1).map(line => line.split(""))

  console.log(algorithm)

  let iteration
  for (iteration = 0; iteration <= 50; iteration++) {
    if (iteration > 0) image = convert(image)
    console.log(image.reduce((acc, line) => acc + line.reduce((acc, el) => acc + (el === '#' ? 1 : 0), 0), 0))
    //console.log(image.map(line => line.join("")).join("\n"))
    console.log("\n")
  }

  function convert(image) {
    const out = []

    for (let y = 0; y <= image.length+3; y++) {
      for (let x = 0; x <= image[0].length+3; x++) {
        function point(y, x) {
          x -= 2
          y -= 2
          if (y >= 0 && y <= image.length-1) {
            if (x >= 0 && x <= image[y].length-1) {
              return image[y][x] === '#' ? 1 : 0
            } else {
              return 1-iteration % 2
            }
          } else {
            return 1-iteration % 2
          }
        }

        const map = [
          point(y-1, x-1),
          point(y-1, x),
          point(y-1, x+1),
          point(y, x-1),
          point(y, x),
          point(y, x+1),
          point(y+1, x-1),
          point(y+1, x),
          point(y+1, x+1)
        ]

        const index = parseInt(map.join(""), 2)

        out[y] = out[y] || []
        out[y][x] = algorithm[index]
      }
    }
    return out
  }
})
