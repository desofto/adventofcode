const fs = require('fs')

const data = fs.readFileSync('./10-2.txt', 'utf8');
let input = data.split("\n").filter(line => line.length > 0);

let x = 1;
let cycle = 0;
let sum = 0;

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

function checkSignalStrength() {
  if ((cycle - 20) % 40 !== 0) return;

  sum += cycle * x;
  console.log(cycle, x, cycle * x, sum);
}
