const fs = require('fs');

const data = fs.readFileSync('./10-2.txt', 'utf8');
let input = data.split("\n").filter(line => line.length > 0);

let x = 1;
let cycle = 0;
const crt = new Array(240).fill(".");

input.forEach(line => {
  if (line.length <= 0) return;

  const [cmd, valStr] = line.split(" ");

  if (cmd === "noop") {
    cycle++;
    checkSignalStrength();
  } else if (cmd === "addx") {
    cycle++;
    checkSignalStrength();
    cycle++;
    checkSignalStrength();
    x += parseInt(valStr);
  } else throw new Error(`Wrong command ${cmd}`)
})

for (let i = 0; i < crt.length; i += 40) {
  console.log(crt.slice(i, i + 40).join(""));
}

function checkSignalStrength() {
  // if ((cycle - 20) % 40 !== 0) return;

  if ((cycle-1) % 40 >= x - 1 && (cycle-1) % 40 <= x + 2 - 1) {
    crt[cycle-1] = "#";
  } else {
    crt[cycle-1] = ".";
  }
}
