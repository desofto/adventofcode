const fs = require('fs')

const data = fs.readFileSync('./3-2.txt', 'utf8');
let input = data.split("\n");

let sum = 0;
input.forEach(rucksack => {
  const compartment1 = rucksack.substring(0, rucksack.length / 2);
  const compartment2 = rucksack.substring(rucksack.length / 2);

  const diff = [];
  for (let i = 0; i < compartment1.length; i++) {
    const el = compartment1[i];
    if (!diff.includes(el) && compartment2.indexOf(el) >= 0) {
      diff.push(el);
      const ord = el.charCodeAt(0);
      if (ord >= 97) {
        sum += 1 + ord - 97;
      } else {
        sum += 26 + 1 + ord - 65;
      }
    }
  }
});

console.log(sum)
