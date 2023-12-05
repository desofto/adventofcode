const data = require('fs').readFileSync("./22-2.txt", "utf8");
const input = data.split("\n").filter(line => line.length > 0);
const path = input.pop().match(/(\d+|[LR]+)/g);
const map = input.map(line => line.split(""));

const RIGHT = 0;
const DOWN = 1;
const LEFT = 2;
const UP = 3;

let y = 0;
let x = 0;
let facing = RIGHT;

while (map[y][x] === " ") x++;

while (path.length > 0) {
  const cmd = path.shift();

  if (cmd === "L") {
    facing--;
    if (facing < 0) facing = 3;
  } else if (cmd === "R") {
    facing++;
    if (facing > 3) facing = 0;
  } else {
    for (let step = 1; step <= Number(cmd); step++) {
      let xx = x, yy = y, ffacing = facing;
      switch (ffacing) {
        case 0: xx++; break;
        case 1: yy++; break;
        case 2: xx--; break;
        case 3: yy--; break;
      }
      if (yy < 0 || xx < 0 || yy > map.length-1 || xx > map[yy].length-1 || map[yy][xx] === " ") {
        [xx, yy, ffacing] = translate2(xx, yy, ffacing);
      }

      if (map[yy][xx] === "#") break;

      x = xx;
      y = yy;
      facing = ffacing;
    }
  }

  // console.log(cmd, x, y, facing, 1000*(y+1) + 4*(x+1) + facing);
  // if (path.length < 1) break;
}

console.log(x, y, facing, 1000*(y+1) + 4*(x+1) + facing);

function translate1(x, y, facing) {
  switch (facing) {
    case 0:
      if (y < 4) {
        const d = y;
        return [4*4-1, 3*4-1-d, 2];
      } else if (y < 2*4) {
        const d = y - 4*1;
        return [4*4-1 - d, 2*4, 1];
      } else {
        const d = y - 2*4;
        return [3*4-1, (1*4-1) - d, 2]
      }
    case 1:
      if (x < 4) {
        const d = x;
        return [3*4-1 - d, 3*4-1, 3];
      } else if (x < 2*4) {
        const d = x - 1*4;
        return [2*4, 3*4-1 - d, 0];
      } else if (x < 3*4) {
        const d = x - 2*4;
        return [1*4-1 - d, 2*4-1, 3];
      } else {
        return [0, 2*4-1 - (x - 3*4), 0];
      }
    case 2:
      if (y < 4) {
        return [1*4 + y, 1*4, 1];
      } else if (y < 2*4) {
        return [4*4-1 - (x - 1*4), 3*4-1, 3];
      } else {
        return [2*4-1 - (y - 2*4), 3];
      }
    case 3:
      if (x < 4) {
        return [3*4-1 - x, 0, 1];
      } else if (x < 2*4) {
        return [2*4, 0 + (x - 1*4), 0];
      } else if (x < 3*4) {
        const d = x - 3*4;
        return [1*4-1 - d, 1*4, 1];
      } else {
        return [3*4-1, 2*4-1 - (x - 3*4), 2];
      }
  }
}

function translate2(x, y, facing) {
  switch (facing) {
    case RIGHT:
      if (y < 1*50) {
        return [2*50-1, 3*50-1 - y % 50, LEFT];
      } else if (y < 2*50) {
        return [2*50 + y % 50, 1*50-1, UP];
      } else if (y < 3*50) {
        return [3*50-1, 1*50-1 - y % 50, LEFT];
      } else {
        return [1*50 + y % 50, 3*50-1, UP];
      }
    case DOWN:
      if (x < 1*50) {
        return [2*50 + x % 50, 0, DOWN];
      } else if (x < 2*50) {
        return [1*50-1, 3*50 + x % 50, LEFT];
      } else {
        return [2*50-1, 1*50 + x % 50, LEFT];
      }
    case LEFT:
      if (y < 1*50) {
        return [0*50, 3*50-1 - y % 50, RIGHT];
      } else if (y < 2*50) {
        return [0*50 + y % 50, 2*50, DOWN];
      } else if (y < 3*50) {
        return [1*50, 1*50-1 - y % 50, RIGHT];
      } else {
        return [1*50 + y % 50, 0*50, DOWN];
      }
    case UP:
      if (x < 1*50) {
        return [1*50, 1*50 + x % 50, RIGHT];
      } else if (x < 2*50) {
        return [0, 3*50 + x % 50, RIGHT];
      } else {
        return [0*50 + x % 50, 4*50-1, UP];
      }
  }
}
