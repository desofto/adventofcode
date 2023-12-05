const fs = require('fs')

const data = fs.readFileSync('./8-2.txt', 'utf8');
let input = data.split("\n").filter(line => line.length > 0);

let max = 0;

for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[y].length; x++) {
    const score = visibleScore(x, y);
    if (score > max) console.log(x, y, score);
    max = Math.max(max, score);
  }
}

console.log(max);

function visibleScore(x, y) {
  let score = 1;
  const value = input[y][x];

  {
    let count = 0;
    for (let xx = x-1; xx >= 0; xx--) {
      count++;
      const v = input[y][xx];
      if (v >= value) break;
    }

    score *= count;
  }

  {
    let count = 0;
    for (let xx = x+1; xx < input[y].length; xx++) {
      count++;
      const v = input[y][xx];
      if (v >= value) break;
    }

    score *= count;
  }

  {
    let count = 0;
    for (let yy = y-1; yy >= 0; yy--) {
      count++;
      const v = input[yy][x];
      if (v >= value) break;
    }

    score *= count;
  }

  {
    let count = 0;
    for (let yy = y+1; yy < input.length; yy++) {
      count++;
      const v = input[yy][x];
      if (v >= value) break;
    }

    score *= count;
  }


  return score;
}
