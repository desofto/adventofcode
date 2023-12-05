const fs = require('fs')

const data = fs.readFileSync('./13-2.txt', 'utf8');
let input = data.split("\n").filter(line => line.length > 0);

let sum = 0;
for (let index = 0; index < input.length; index += 2) {
  const list1 = JSON.parse(input[index]);
  const list2 = JSON.parse(input[index+1]);
  // console.log(list1, list2)

  const i = 1 + index / 2;
  const res = isCorrect(list1, list2);
  if (res) sum += i;
  console.log(i, res);
  console.log()
}
console.log(sum);

function isCorrect(el1, el2) {
  if (Array.isArray(el1)) {
    if (Array.isArray(el2)) {
      let i1 = 0, i2 = 0;
      while (true) {
        if (i1 >= el1.length && i2 >= el2.length) return undefined;
        if (i1 >= el1.length) return true;
        if (i2 >= el2.length) return false;
        const res = isCorrect(el1[i1], el2[i2]);
        if (res !== undefined) return res;
        i1++; i2++;
      }
    } else {
      return isCorrect(el1, [el2]);
    }
  } else {
    if (Array.isArray(el2)) {
      return isCorrect([el1], el2);
    } else {
      if (el1 < el2) return true;
      if (el1 > el2) return false;
      return undefined;
    }
  }
}
