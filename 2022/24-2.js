const data = require('fs').readFileSync("./24-2.txt", "utf8");
const input = data.split("\n").filter(line => line.length > 0);

const S = { x: 0, y: 0 };
const E = { x: 0, y: 0 };

const maxY = input.length-1;
const maxX = input[0].length-1;

const UP = "^";
const RIGHT = ">";
const DOWN = "v";
const LEFT = "<";

class Blizzard {
  static blizzards = [];

  static step() {
    Blizzard.blizzards.forEach(blizzard => {
      if (blizzard.dir === UP) { blizzard.y--; if (blizzard.y <= 0) blizzard.y = maxY - 1; }
      if (blizzard.dir === RIGHT) { blizzard.x++; if (blizzard.x >= maxX) blizzard.x = 1; }
      if (blizzard.dir === DOWN) { blizzard.y++; if (blizzard.y >= maxY) blizzard.y = 1; }
      if (blizzard.dir === LEFT) { blizzard.x--; if (blizzard.x <= 0) blizzard.x = maxX - 1; }
    })
  }

  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
  }
}

Blizzard.blizzards = [];
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
      Blizzard.blizzards.push(new Blizzard(x, y, el))
    }
  })
})

let map = [];
for (let i = 0; i <= maxY; i++) {
  const row = [];
  for (let j = 0; j <= maxX; j++) {
    row.push(-1);
  }
  map.push(row);
}

map[S.y][S.x] = "X";

let step = 0;
do {
  step++;
  Blizzard.step();

  const map2 = []
  for (let y = 0; y <= maxY; y++) {
    const row = [];
    for (let x = 0; x <= maxX; x++) {
      row.push(".");
    }
    map2.push(row);
  }

  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (map[y][x] === "X") {
        if (y > 0) map2[y-1][x] = "X";

        if (x > 0) map2[y][x-1] = "X";
        map2[y][x] = "X";
        if (x < maxX) map2[y][x+1] = "X";

        if (y < maxY) map2[y+1][x] = "X";
      }
    }
  }

  if (map2[E.y][E.x] === "X") break;

  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if ((y === 0 || y === maxY || x === 0 || x === maxX) && !(x === S.x && y === S.y) && !(x === E.x && y === E.y)) {
        map2[y][x] = "#";
      }
    }
  }

  Blizzard.blizzards.forEach(blizzard => {
    map2[blizzard.y][blizzard.x] = ".";
  });

  map = map2;

  console.log(step);
  map.forEach(row => {
    console.log(row.join(""));
  })
  console.log();

  // if (step === 5) break;
} while (map[E.y][E.x] != "X");

console.log(step);
