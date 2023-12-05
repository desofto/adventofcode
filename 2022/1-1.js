const fs = require('fs')

const data = fs.readFileSync('./1.txt', 'utf8');
let input = data.split("\n");

let maxSum = 0;
let sum = 0;
input.forEach(line => {
  if (line.length > 0) {
    const calories = parseInt(line);
    sum += calories;
  } else {
    if (sum > maxSum) maxSum = sum;
    sum = 0;
  }
});

console.log(maxSum)
