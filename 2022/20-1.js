const data = require('fs').readFileSync("./20-2.txt", "utf8");
const input = data.split("\n").filter(line => line.length > 0).map((el, index) => ({ value: Number(el), index }));

for (let i = 0; i < input.length; i++) {
  const el = input.find(el => el.index === i);
  const index = input.indexOf(el);

  let ni = index + el.value;
  // let ni = newIndex;
  // while (newIndex >= input.length-1) newIndex = newIndex - input.length + 1;
  // while (newIndex <= 0) newIndex = input.length + newIndex - 1;

  while (ni >= input.length-1) {
    ni = ni - Math.ceil(ni / input.length) * input.length + Math.ceil(ni / input.length);
  }
  while (ni < 0) {
    ni = Math.ceil(-ni / input.length) * input.length + ni + Math.floor(ni / input.length);
  }

  // if (newIndex !== ni) { console.log("!!!", ni, newIndex); abort(); }

  input.splice(index, 1);
  input.splice(ni, 0, el);

  // console.log(input.map(el => el.value).join(" "));
}

const el = input.find(el => el.value === 0);
const index = input.indexOf(el);
const [x, y, z] = [input[(index + 1000) % input.length].value, input[(index + 2000) % input.length].value, input[(index + 3000) % input.length].value];
console.log(x, y, z, x+y+z)
