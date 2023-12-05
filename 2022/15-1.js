const fs = require('fs');

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

  map.min.x = Math.min(map.min.x, pair.s.x - pair.dist);
  map.min.y = Math.min(map.min.y, pair.s.y - pair.dist);
  map.max.x = Math.max(map.max.x, pair.s.x + pair.dist);
  map.max.y = Math.max(map.max.y, pair.s.y + pair.dist);
  pairs.push(pair)
})

let count = 0;
const y = 2000000;
for (let x = map.min.x; x <= map.max.x; x++) {
  if (x % 1000 === 0) console.log(x, map.max.x)
  if (isEmpty(x, y)) count++;
}

console.log(count);

function isEmpty(x, y) {
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    if (pair.b.x === x && pair.b.y === y) continue;
    const dist = Math.abs(x - pair.s.x) + Math.abs(y - pair.s.y);
    if (dist <= pair.dist) return true;
  }

  return false;
}
