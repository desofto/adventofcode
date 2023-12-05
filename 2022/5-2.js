const fs = require('fs')

const data = fs.readFileSync('./5-2.txt', 'utf8');
let input = data.split("\n");

const crates = [];

let step = 0;
input.forEach(line => {
  if (step === 0) {
    if (line.length > 0) {
      for (let i = 1; i < line.length; i += 4) {
        if (line[i-1] === "[" && line[i+1] === "]") {
          const index = (i - 1) / 4;
          crates[index] = crates[index] || [];
          crates[index].unshift(line[i]);
        }
      }
    } else {
      step++;
    }
  } else if (step === 1) {
    if (line.length > 0) {
      const [_move, count, _from, from, _to, to] = line.split(" ").map(e => parseInt(e));
      crates[to-1].push(...crates[from-1].splice(-count));
    }
  }
});

console.log(crates.map(crate => crate.pop()).join(""));
