const fs = require('fs');
const { abort } = require('process');

const data = fs.readFileSync('./15-2.txt', 'utf8');
let input = data.split("\n").filter(line => line.length > 0);

const pairs = [];
const map = {
  min: { x: 0, y: 0 },
  max: { x: 0, y: 0 }
}
input.forEach(line => {
  const [_, sx, sy, bx, by] = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/)
  const pair = {
    s: {
      x: parseInt(sx),
      y: parseInt(sy)
    },
    b: {
      x: parseInt(bx),
      y: parseInt(by)
    },
  }
  pair.dist = Math.abs(pair.b.x - pair.s.x) + Math.abs(pair.b.y - pair.s.y);

  map.min.x = Math.min(map.min.x, pair.s.x);
  map.min.y = Math.min(map.min.y, pair.s.y);
  map.max.x = Math.max(map.max.x, pair.s.x);
  map.max.y = Math.max(map.max.y, pair.s.y);
  pairs.push(pair)
})

for (let y = 0; y < 4000000; y++) {
  if (y % 100 === 0) console.log(y)
  for (let x = map.min.x; x <= map.max.x; x++) {
    const pair = isEmpty(x, y);
    if (pair) {
      x = pair.s.x + (pair.dist - Math.abs(y - pair.s.y));
    } else {
      console.log(x, y, x * 4000000 + y)
      abort()
    }
  }
}

function isEmpty(x, y) {
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    // if (pair.b.x === x && pair.b.y === y) continue;
    const dist = Math.abs(x - pair.s.x) + Math.abs(y - pair.s.y);
    if (dist <= pair.dist) return pair;
  }

  return false;
}
