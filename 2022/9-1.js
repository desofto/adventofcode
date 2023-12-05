const fs = require('fs')

const data = fs.readFileSync('./9-2.txt', 'utf8');
let input = data.split("\n").filter(line => line.length > 0);

const head = { x: 0, y: 0 };
const tail = { x: 0, y: 0 };
const visited = [{ x: 0, y: 0 }];

input.forEach(line => {
  if (line.length <= 0) return;

  const [dir, stepsStr] = line.split(" ");
  let steps = parseInt(stepsStr);

  while (steps > 0) {
    switch(dir) {
      case "U": head.y--; break;
      case "D": head.y++; break;
      case "L": head.x--; break;
      case "R": head.x++; break;
      default: throw new Error(`Wrong direction ${dir}`)
    }

    adjustTail();

    steps--;
  }
})

console.log(visited.length)

function adjustTail() {
  if (Math.abs(head.x - tail.x) <= 1 && Math.abs(head.y - tail.y) <= 1) return;

  if (head.x === tail.x) {
    tail.y += Math.sign(head.y - tail.y);
  } else if (head.y === tail.y) {
    tail.x += Math.sign(head.x - tail.x);
  } else {
    tail.x += Math.sign(head.x - tail.x);
    tail.y += Math.sign(head.y - tail.y);
  }

  const found = visited.find(v => v.x === tail.x && v.y === tail.y);
  if (!found) {
    visited.push({ ...tail })
  }
}
