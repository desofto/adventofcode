// https://adventofcode.com/2021/day/17

const target = {
  x: [137, 171],
  y: [-98, -73]
}

let maxY = 0

let dx = 0
for(let sum = 0; sum < target.x[0]; sum += dx) dx++
let dy = Math.abs(target.y[0]) - 1

console.log(dx, dy)

let x = 0
let y = 0

while (true) {
  x += dx
  y += dy
  if (dx > 0) dx--
  dy--
  maxY = Math.max(y, maxY)
  console.log(x, y)

  if (x >= target.x[0] && x <= target.x[1] && y >= target.y[0] && y <= target.y[1]) {
    console.log("Hit!", maxY)
    break
  }

  if (y < target.y[1]) {
    console.log("Miss...")
    break
  }
}
