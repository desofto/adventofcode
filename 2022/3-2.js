const fs = require('fs')

const data = fs.readFileSync('./3-2.txt', 'utf8');
let input = data.split("\n");

let sum = 0;
let rucksacks = [];
input.forEach(rucksack => {
  rucksacks.push(rucksack);
  if (rucksacks.length < 3) return;

  for (let i = 0; i < rucksacks[0].length; i++) {
    el = rucksacks[0][i];

    if (rucksacks[0].indexOf(el) < i) continue;
    if (rucksacks[1].indexOf(el) < 0) continue;
    if (rucksacks[2].indexOf(el) < 0) continue;

    console.log(el)

    const ord = el.charCodeAt(0);
    if (ord >= 97) {
      sum += 1 + ord - 97;
    } else {
      sum += 26 + 1 + ord - 65;
    }
  }

  rucksacks = [];
});

console.log(sum)
