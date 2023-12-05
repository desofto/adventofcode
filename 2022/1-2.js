const fs = require('fs')

const data = fs.readFileSync('./1.txt', 'utf8');
let input = data.split("\n");

let elvesCalories = [];
let sum = 0;
input.forEach(line => {
  if (line.length > 0) {
    const calories = parseInt(line);
    sum += calories;
  } else {
    elvesCalories.push(sum);
    sum = 0;
  }
});
elvesCalories.sort((a, b) => b - a);

console.log(elvesCalories[0] + elvesCalories[1] + elvesCalories[2])
