const data = require('fs').readFileSync("./24-2.txt", "utf8");
const input = data.split("\n").filter(line => line.length > 0);

// 220 > < 243

const S = { x: 0, y: 0 };
const E = { x: 0, y: 0 };

const maxY = input.length-1;
const maxX = input[0].length-1;

const UP = "^";
const RIGHT = ">";
const DOWN = "v";
const LEFT = "<";

class Blizzard {
  static drawMap(blizzards) {
    const map = []
    for (let i = 0; i <= maxY; i++) {
      const row = [];
      for (let j = 0; j <= maxX; j++) {
        if (i === 0 || i === maxY || j === 0 || j === maxX) {
          row.push("#");
        } else {
          row.push(".");
        }
      }
      map.push(row);
    }

    map[S.y][S.x] = ".";
    map[E.y][E.x] = ".";

    blizzards.forEach(blizzard => {
      map[blizzard.y][blizzard.x] = blizzard.dir;
    });

    return map;
  }

  static step(blizzards) {
    return blizzards.map(({ x, y, dir }) => {
      if (dir === UP) { y--; if (y <= 0) y = maxY - 1; }
      if (dir === RIGHT) { x++; if (x >= maxX) x = 1; }
      if (dir === DOWN) { y++; if (y >= maxY) y = 1; }
      if (dir === LEFT) { x--; if (x <= 0) x = maxX - 1; }

      return { x, y, dir };
    });
  }

  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
  }
}

const visited = {};

let s = 0;
let bestSteps = undefined;
function go(step, blizzards, { x, y }) {
  function print() {
    console.log(step, ":", bestSteps);
    const map = Blizzard.drawMap(blizzards);
    map[y][x] = "X";

    map.forEach(row => {
      console.log(row.join(""));
    })
    console.log();
    // if (s > 40) throw "abort";
  }

  // const hash = [x, y, step].join("-");
  // if (visited[hash] && visited[visited] <= step) {
  //   console.log("!")
  //   return;
  // }
  // visited[hash] = step;

  if (step > 1000) return;
  s++;
  if (s > 10000) {
    console.log(step, ":", bestSteps, Object.keys(visited).length);
    s = 0;
  }

  if (x === E.x && y === E.y) {
    if (bestSteps === undefined || step < bestSteps) {
      bestSteps = step;
      console.log("!", step, ":", bestSteps, Object.keys(visited).length);
    }
    return;
  }

  if (bestSteps !== undefined && step + Math.abs(E.x - x) + Math.abs(E.y - y) >= bestSteps) return;

  // print();

  blizzards = Blizzard.step(blizzards);

  {
    let left = (y > 0 && y < maxY) && x > 1;
    let right = (y > 0 && y < maxY) && x < maxX-1;
    let up = y > 1 || (x === S.x && y === S.y+1);
    let down = y < maxY-1 || (x === E.x && y === E.y-1);
    let stay = true;

    blizzards.forEach(blizzard => {
      if (left && blizzard.x === x-1 && blizzard.y === y) left = false;
      if (right && blizzard.x === x+1 && blizzard.y === y) right = false;
      if (up && blizzard.x === x && blizzard.y === y-1) up = false;
      if (down && blizzard.x === x && blizzard.y === y+1) down = false;
      if (stay && blizzard.x === x && blizzard.y === y) stay = false;
    });

    if (right) go(step+1, blizzards, { x: x+1, y: y });
    if (down) go(step+1, blizzards, { x: x, y: y+1 });
    if (up) go(step+1, blizzards, { x: x, y: y-1 });
    if (left) go(step+1, blizzards, { x: x-1, y: y });
    if (stay) go(step+1, blizzards, { x: x, y: y });
  }

  // {
  //   const map = Blizzard.drawMap(blizzards);

  //   const right2 = (x < maxX && map[y][x+1] === ".");
  //   if (right2 !== right) throw "right2";

  //   const down2 = (y < maxY && map[y+1][x] === ".");
  //   if (down2 !== down) throw "down2";

  //   const up2 = (y > 0 && map[y-1][x] === ".");
  //   if (up2 !== up) throw "up2";

  //   const left2 = (x > 0 && map[y][x-1] === ".");
  //   if (left2 !== left) throw "left2";

  //   const stay2 = (map[y][x] === "." || map[y][x] === "X");
  //   if (stay2 !== stay) throw "stay2";

  //   if (right2) go(step+1, blizzards, { x: x+1, y: y });
  //   if (down2) go(step+1, blizzards, { x: x, y: y+1 });
  //   if (up2) go(step+1, blizzards, { x: x, y: y-1 });
  //   if (left2) go(step+1, blizzards, { x: x-1, y: y });
  //   if (stay2) go(step+1, blizzards, { x: x, y: y });
  // }
}

const blizzards = [];
input.forEach((line, y) => {
  line.split("").forEach((el, x) => {
    if (y === 0) {
      if (el === ".") {
        S.x = x;
        S.y = y;
      }
    } else if (y === maxY) {
      if (el === ".") {
        E.x = x;
        E.y = y;
      }
    } else if (el !== "#" && el !== ".") {
      blizzards.push(new Blizzard(x, y, el))
    }
  })
})

go(0, blizzards, { ...S });

console.log(bestSteps);
