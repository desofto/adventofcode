const fs = require('fs')

const data = fs.readFileSync('./6-2.txt', 'utf8');
let input = data.split("\n");

input.forEach(line => {
  for (let i = 0; i < line.length; i++) {
    const four = line.substring(i, i + 4);

    let found = false;
    for (let j = 1; j < four.length; j++) {
      if (four.indexOf(four[j]) !== j) {
        found = true;
        break;
      }
    }

    if (found) continue;

    console.log(i + four.length);
    break;
  }
});
