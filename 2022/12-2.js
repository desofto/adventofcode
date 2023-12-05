const fs = require('fs')

const data = fs.readFileSync('./12-2.txt', 'utf8');
let input = data.split("\n").filter(line => line.length > 0);

const map = [];
const end = {};

input.forEach((line, index) => {
  map.push(
    line.split("").map((e, i) => {
      if (e === "S") {
        return "a".charCodeAt(0) - "a".charCodeAt(0);
      } else if (e === "E") {
        end.x = i;
        end.y = index;

        return "z".charCodeAt(0) - "a".charCodeAt(0);
      }
      return e.charCodeAt(0) - "a".charCodeAt(0);
    })
  );
})

const path = map.map(row => row.map(e => map.length * map[0].length));
path[end.y][end.x] = 0;

let changed;
do {
  changed = false;

  path.forEach((row, y) => {
    row.forEach((steps, x) => {
      if (x > 0 && map[y][x-1] >= map[y][x] - 1 && path[y][x-1] > steps + 1) {
        path[y][x-1] = steps + 1;
        changed = true;
      }

      if (x < map[y].length - 1 && map[y][x+1] >= map[y][x] - 1 && path[y][x+1] > steps + 1) {
        path[y][x+1] = steps + 1;
        changed = true;
      }

      if (y > 0 && map[y-1][x] >= map[y][x] - 1 && path[y-1][x] > steps + 1) {
        path[y-1][x] = steps + 1;
        changed = true;
      }

      if (y < map.length - 1 && map[y+1][x] >= map[y][x] - 1 && path[y+1][x] > steps + 1) {
        path[y+1][x] = steps + 1;
        changed = true;
      }
    })
  })
  console.log(path)
} while (changed);


const res = {};

map.forEach((row, y) => {
  row.forEach((el, x) => {
    if (el === 0) {
      res[path[y][x]] = { x, y, steps: path[y][x] };
    }
  })
})

console.log(res[Object.keys(res).sort((a, b) => a - b).shift()])
