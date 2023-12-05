const fs = require('fs')

const data = fs.readFileSync('./8-2.txt', 'utf8');
let input = data.split("\n").filter(line => line.length > 0);

let count = 0;

for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[y].length; x++) {
    if (isVisible(x, y)) count++;
    // else console.log(x, y)
  }
}

console.log(count);

// console.log(isVisible(3, 1))

function isVisible(x, y) {
  let visible = false;
  const value = input[y][x];

  {
    let xx = x-1;
    do {
      if (xx < 0) visible = true;
      else if (input[y][xx] >= value) break;
      xx--;
    } while(xx >= -1)
  }

  {
    let xx = x+1;
    do {
      if (xx >= input[y].length) visible = true;
      else if (input[y][xx] >= value) break;
      xx++;
    } while(xx <= input[y].length+1)
  }

  {
    let yy = y-1;
    do {
      if (yy < 0) visible = true;
      else if (input[yy][x] >= value) break;
      yy--;
    } while(yy >= -1)
  }

  {
    let yy = y+1;
    do {
      if (yy >= input.length) visible = true;
      else if (input[yy][x] >= value) break;
      yy++;
    } while(yy <= input.length+1)
  }

  return visible;
}
