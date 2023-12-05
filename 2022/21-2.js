const data = require('fs').readFileSync("./21-2.txt", "utf8");
const input = data.split("\n").filter(line => line.length > 0);

const monkeys = {};

let humn = 0;

class Monkey {
  constructor (name, rule) {
    this.name = name;
    this.rule = rule;
    this.involved = false
  }

  yell() {
    this.involved = true;

    const [l, o, r] = this.rule.split(" ");

    if (this.name === "root") {
      return monkeys[l].yell() - monkeys[r].yell();
    }

    if (this.name === "humn") {
      return humn;
    }

    if (o === "+") return monkeys[l].yell() + monkeys[r].yell();
    if (o === "-") return monkeys[l].yell() - monkeys[r].yell();
    if (o === "*") return monkeys[l].yell() * monkeys[r].yell();
    if (o === "/") return monkeys[l].yell() / monkeys[r].yell();

    const number = Number(this.rule);
    if (this.rule === String(number)) return number;

    throw new Error(`Wrong rule ${this.rule}`);
  }
}

input.forEach(line => {
  const [name, rule] = line.split(":").map(e => e.trim());

  monkeys[name] = new Monkey(name, rule);
});

let start = 0000000000000;
let end   = 9999999999999;

humn = start;
let startDiff = monkeys.root.yell();
humn = end;
let endDiff = monkeys.root.yell();

do {
  humn = Math.floor((start + end) / 2);
  const diff = monkeys.root.yell();
  console.log(humn, ":", startDiff, diff, endDiff);
  if (diff < 0) end = humn; else start = humn;
} while (start !== end);
