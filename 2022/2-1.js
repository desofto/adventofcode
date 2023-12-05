const fs = require('fs')

const data = fs.readFileSync('./2-2.txt', 'utf8');
let input = data.split("\n");

const var1 = ["A", "B", "C"];
const var2 = ["X", "Y", "Z"];

function gameResult(a, b) {
  if (a === b) return 0;
  b--; if (b < 0) b = 2;
  return a === b ? 1 : -1;
}

let score = 0;
input.forEach(line => {
  if (line.length <= 0) return;

  const [r1, r2] = line.split(" ");
  score += 1 + var2.indexOf(r2);
  score += 3 * (1 + gameResult(var1.indexOf(r1), var2.indexOf(r2)));
});

console.log(score);
