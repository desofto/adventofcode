const data = require('fs').readFileSync("./20-2.txt", "utf8");
const key = 811589153;
const input = data.split("\n").filter(line => line.length > 0).map((el, index) => ({ value: key * Number(el), index }));

for (let turn = 1; turn <= 10; turn++) {
  for (let i = 0; i < input.length; i++) {
    const el = input.find(el => el.index === i);
    const index = input.indexOf(el);

    let ni = index + el.value;
    // let ni2 = ni;

    // while (ni2 >= input.length-1) ni2 = ni2 - input.length + 1;
    // while (ni2 < 0) ni2 = input.length + ni2 - 1;

    while (ni >= input.length-1) {
      ni = ni - Math.ceil(ni / input.length) * input.length + Math.ceil(ni / input.length);
      // console.log("+", ni)
    }
    while (ni < 0) {
      ni = Math.ceil(-ni / input.length) * input.length + ni + Math.floor(ni / input.length);
      // console.log("-", ni)
    }

    // if (ni2 !== ni) { console.log("!!!", el.value, index, ni, ni2); abort(); }

    input.splice(index, 1);
    input.splice(ni, 0, el);

    console.log(">", turn, i);//, input.map(el => el.value).join(" "));
  }
}

const el = input.find(el => el.value === 0);
const index = input.indexOf(el);
const [x, y, z] = [input[(index + 1000) % input.length].value, input[(index + 2000) % input.length].value, input[(index + 3000) % input.length].value];
console.log(x, y, z, x+y+z)
