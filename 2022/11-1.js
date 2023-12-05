const fs = require('fs');

const data = fs.readFileSync('./11-2.txt', 'utf8');
let input = data.split("\n");

const monkeys = [];

for (let i = 0; i < input.length; i += 7) {
  const [keywordMonkey, indexStr] = input[i].trim().split(" ").map(e => e.trim());
  if (keywordMonkey !== "Monkey") throw new Error(`Wrong keyword ${keywordMonkey}`);
  const index = parseInt(indexStr);
  const monkey = {};
  monkeys[index] = monkey;

  const [keywordStarting, items] = input[i+1].trim().split(":").map(e => e.trim());
  if (keywordStarting !== "Starting items") throw new Error(`Wrong keyword ${keywordStarting}`);
  monkey.items = items.split(",").map(e => parseInt(e.trim()));

  const [keywordOperation, operation] = input[i+2].trim().split(":").map(e => e.trim());
  if (keywordOperation !== "Operation") throw new Error(`Wrong keyword ${keywordOperation}`);
  if (!operation.startsWith("new =")) throw new Error(`Wrong operation ${operation}`);
  monkey.operation = operation.substring(5).trim();

  const [keywordTest, test] = input[i+3].trim().split(":").map(e => e.trim());
  if (keywordTest !== "Test") throw new Error(`Wrong keyword ${keywordTest}`);
  if (!test.startsWith("divisible by")) throw new Error(`Wrong test ${test}`);
  monkey.test = test.substring(12).trim();

  const [keywordIfTrue, ifTrue] = input[i+4].trim().split(":").map(e => e.trim());
  if (keywordIfTrue !== "If true") throw new Error(`Wrong keyword ${keywordIfTrue}`);
  if (!ifTrue.startsWith("throw to monkey")) throw new Error(`Wrong ifTrue ${ifTrue}`);
  monkey.ifTrue = ifTrue.substring(15).trim();

  const [keywordIfFalse, ifFalse] = input[i+5].trim().split(":").map(e => e.trim());
  if (keywordIfFalse !== "If false") throw new Error(`Wrong keyword ${keywordIfFalse}`);
  if (!ifFalse.startsWith("throw to monkey")) throw new Error(`Wrong ifFalse ${ifFalse}`);
  monkey.ifFalse = ifFalse.substring(15).trim();

  monkey.inspections = 0;

  if (!input[i+6].length <= 0) throw new Error(`Wrong line ${input[i+6]}`);
}

for (let round = 1; round <= 20; round++) {
  for (let i = 0; i < monkeys.length; i++) {
    const monkey = monkeys[i];

    while (monkey.items.length > 0) {
      let old = monkey.items.shift();
      let worryLevel = Math.floor(eval(monkey.operation) / 3);

      if (worryLevel % monkey.test === 0) {
        monkeys[monkey.ifTrue].items.push(worryLevel);
      } else {
        monkeys[monkey.ifFalse].items.push(worryLevel);
      }

      monkey.inspections++;
    }
  }
}

// for (let i = 0; i < monkeys.length; i++) {
//   console.log(`Monkey ${i}: ${monkeys[i].items.join(", ")}`);
// }

const [m1, m2] = monkeys.map(m => m.inspections).sort((a, b) => b - a).slice(0, 2);
console.log(m1, m2, m1 * m2);
