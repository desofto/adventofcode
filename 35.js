// https://adventofcode.com/2021/day/19

const fs = require('fs');

fs.readFile('./35.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n").filter(line => line.length > 0)

  const scanners = []
  const beacons = []
  const pool = []
  input.forEach(line => {
    if (line.startsWith("---")) {
      if (pool.length > 0) {
        scanners.push(null)
        beacons.push(pool.splice(0))
      }
    } else {
      pool.push(line.split(",").map(el => parseInt(el)))
    }
  })
  if (pool.length > 0) {
    scanners.push(null)
    beacons.push(pool.splice(0))
  }
  scanners[0] = [0, 0, 0]

  while (true) {
    let found = false
    for (let i = 0; i < scanners.length; i++) {
      if (scanners[i]) {
        for (let j = 0; j < scanners.length; j++) {
          if (!scanners[j]) {
            const res = overlap(scanners[i], beacons[i], beacons[j])
            if (res) {
              scanners[j] = res[0]
              beacons[j] = res[1]
              found = true
            }
          }
        }
      }
    }
    if (!found) break
  }

  console.log(scanners)

  const total = []
  for (let i = 0; i < beacons.length; i++) {
    const [x, y, z] = scanners[i]
    console.log()

    for (let j = 0; j < beacons[i].length; j++) {
      const b = (x + beacons[i][j][0]) + ',' + (y + beacons[i][j][1]) + ',' + (z + beacons[i][j][2])
      console.log(b)
      if (total.indexOf(b) < 0) total.push(b)
    }
  }

  console.log(total.length)
  console.log(total.sort())
  console.log(scanners)

  function overlap([x, y, z], b1, b2) {
    for(let r = 0; r < 48; r++) {
      const b = rotate(b2, r)
      for(let i1 = 0; i1 < b1.length; i1++) {
        for(let i2 = 0; i2 < b2.length; i2++) {
          let common = 0
          for(let j1 = 0; j1 < b1.length; j1++) {
            for(let j2 = 0; j2 < b2.length; j2++) {
              if (b1[j1][0] - b1[i1][0] === b[j2][0] - b[i2][0] && b1[j1][1] - b1[i1][1] === b[j2][1] - b[i2][1] && b1[j1][2] - b1[i1][2] === b[j2][2] - b[i2][2]) {
                common++
              }
            }
          }
          if (common >= 12) {
            const [x1, y1, z1] = b1[i1]
            const [x2, y2, z2] = b[i2]
            return [[x + x1 - x2, y + y1 - y2, z + z1 - z2], b]
          }
        }
      }
    }
  }

  function rotate(beacons, index) {
    return beacons.map(([x, y, z]) => {
      switch (index) {
        case  0: return [x, y, z]
        case  1: return [x, y, -z]
        case  2: return [x, -y, z]
        case  3: return [x, -y, -z]
        case  4: return [x, z, y]
        case  5: return [x, z, -y]
        case  6: return [x, -z, y]
        case  7: return [x, -z, -y]
        case  8: return [-x, y, z]
        case  9: return [-x, y, -z]
        case 10: return [-x, -y, z]
        case 11: return [-x, -y, -z]
        case 12: return [-x, z, y]
        case 13: return [-x, z, -y]
        case 14: return [-x, -z, y]
        case 15: return [-x, -z, -y]
        case 16: return [y, x, z]
        case 17: return [y, x, -z]
        case 18: return [y, -x, z]
        case 19: return [y, -x, -z]
        case 20: return [y, z, x]
        case 21: return [y, z, -x]
        case 22: return [y, -z, x]
        case 23: return [y, -z, -x]
        case 24: return [-y, x, z]
        case 25: return [-y, x, -z]
        case 26: return [-y, -x, z]
        case 27: return [-y, -x, -z]
        case 28: return [-y, z, x]
        case 29: return [-y, z, -x]
        case 30: return [-y, -z, x]
        case 31: return [-y, -z, -x]
        case 32: return [z, x, y]
        case 33: return [z, x, -y]
        case 34: return [z, -x, y]
        case 35: return [z, -x, -y]
        case 36: return [z, y, x]
        case 37: return [z, y, -x]
        case 38: return [z, -y, x]
        case 39: return [z, -y, -x]
        case 40: return [-z, x, y]
        case 41: return [-z, x, -y]
        case 42: return [-z, -x, y]
        case 43: return [-z, -x, -y]
        case 44: return [-z, y, x]
        case 45: return [-z, y, -x]
        case 46: return [-z, -y, x]
        case 47: return [-z, -y, -x]
      }
    })
  }
})
