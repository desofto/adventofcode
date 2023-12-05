// https://adventofcode.com/2021/day/17

const target = {
  x: [137, 171],
  y: [-98, -73]
}

let hits = 0

for(let idx = 1; idx <= target.x[1]; idx++) {
  for(let idy = target.y[0]; idy <= Math.abs(target.y[0]) - 1; idy++) {
    let dx = idx
    let dy = idy
    let x = 0
    let y = 0

    while (true) {
      x += dx
      y += dy
      if (dx > 0) dx--
      dy--

      if (x >= target.x[0] && x <= target.x[1] && y >= target.y[0] && y <= target.y[1]) {
        console.log("Hit!", idx, idy)
        hits++
        break
      }

      if (y < target.y[0]) {
        //console.log("Miss...", idx, idy)
        break
      }
    }
  }
}

console.log(">", hits)
