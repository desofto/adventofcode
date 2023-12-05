const fs = require('fs');

const data = fs.readFileSync('./14-2.txt', 'utf8');
let input = data.split("\n").filter(line => line.length > 0);

let maxY = 0;
const blocks = [];
input.forEach(line => {
  let prev = undefined;

  line.split("->").forEach(p => {
    const [x, y] = p.trim().split(",").map(e => parseInt(e));

    if (prev) {
      blocks.push({ from: prev, to: { x, y }})
    }
    prev = { x, y };

    maxY = Math.max(maxY, y);
  })
});

const sandUnits = [];

while (true) {
  let x = 500, y = 0;

  while (true) {
    if (isEmpty(x, y+1)) {
      y++;
      if (y > maxY) break;
    } else if (isEmpty(x-1, y+1)) {
      x -= 1;
      y++;
    } else if (isEmpty(x+1, y+1)) {
      x += 1;
      y++;
    } else {
      sandUnits.push({ x, y });
      break;
    }
  }

  if (y > maxY) break;
};

console.log(sandUnits.length);

function isEmpty(x, y) {
  if (sandUnits.find(s => s.x === x && s.y === y)) return false;

  if (blocks.find(block => {
    if (block.from.y === y && block.to.y === y && x >= Math.min(block.from.x, block.to.x) && x <= Math.max(block.from.x, block.to.x)) return true;
    if (block.from.x === x && block.to.x === x && y >= Math.min(block.from.y, block.to.y) && y <= Math.max(block.from.y, block.to.y)) return true;
  })) return false;

  return true;
}
