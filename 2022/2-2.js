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

  const [v1, v2] = line.split(" ");
  r1 = var1.indexOf(v1);
  r2 = var2.indexOf(v2) - 1;
  r2 += r1;
  if (r2 < 0) r2 = 2;
  if (r2 > 2) r2 = 0;

  score += 1 + r2;
  score += 3 * (1 + gameResult(r1, r2));
});

console.log(score);
