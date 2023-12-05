const fs = require('fs')

const data = fs.readFileSync('./4-2.txt', 'utf8');
let input = data.split("\n");

let count = 0;
input.forEach(line => {
  if (line.length <= 0) return;

  const [r1, r2] = line.split(",");

  const [r1from, r1to] = r1.split("-").map(e => parseInt(e))
  const [r2from, r2to] = r2.split("-").map(e => parseInt(e))

  if (r1from >= r2from && r1to <= r2to || r2from >= r1from && r2to <= r1to) count++;
});

console.log(count);
