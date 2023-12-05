const data = require('fs').readFileSync("./25-2.txt", "utf8");
const input = data.split("\n").filter(line => line.length > 0);

const map = {
  "2": 2,
  "1": 1,
  "0": 0,
  "-": -1,
  "=": -2,
}

function SNAFU2Dec(num) {
  return num.split("").map(el => map[el]).reverse().map((el, i) => el * 5 ** i).reduce((sum, el) => sum + el, 0);
}

function Dec2SNAFU(num) {
  let res = "";

  while (num > 0) {
    res = `${Object.keys(map)[Object.values(map).indexOf((num + 2) % 5 - 2)]}${res}`;
    num = Math.floor((num + 2) / 5);
  }

  return res;
}

let sum = 0;
input.forEach(line => {
  const num = SNAFU2Dec(line);
  sum += num;
})

console.log(sum);
console.log(Dec2SNAFU(sum));

// for (let i = 0; i <= 20; i++) {
//   console.log(i, Dec2SNAFU(i));
// }
// console.log(2022, Dec2SNAFU(2022));
// console.log(12345, Dec2SNAFU(12345));
// console.log(314159265, Dec2SNAFU(314159265));
