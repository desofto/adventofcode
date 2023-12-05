const data = require('fs').readFileSync("./22-2.txt", "utf8");
const input = data.split("\n").filter(line => line.length > 0);
const path = input.pop().match(/(\d+|[LR]+)/g);
const map = input.map(line => line.split(""));

// < 27358

let y = 0;
let x = 0;
let facing = 0;

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
      let xx = x, yy = y;
      switch (facing) {
        case 0: xx++; break;
        case 1: yy++; break;
        case 2: xx--; break;
        case 3: yy--; break;
      }
      if (yy < 0 || xx < 0 || yy > map.length-1 || xx > map[yy].length-1 || map[yy][xx] === " ") {
        switch (facing) {
          case 0:
            while (xx > 0 && map[yy][xx-1] !== " ") xx--;
            break;
          case 1:
            while (yy > 0 && xx < map[yy-1].length-1 && map[yy-1][xx] !== " ") yy--;
            break;
          case 2:
            while (xx < map[yy].length-1 && map[yy][xx+1] !== " ") xx++;
            break;
          case 3:
            while (yy < map.length-1 && xx < map[yy+1].length-1 && map[yy+1][xx] !== " ") yy++;
            break;
        }
      }

      if (map[yy][xx] === "#") break;

      x = xx;
      y = yy;
    }
  }

  // console.log(cmd, x, y, facing, 1000*(y+1) + 4*(x+1) + facing);
  // if (path.length < 4000) break;
}

console.log(x, y, facing, 1000*(y+1) + 4*(x+1) + facing);
