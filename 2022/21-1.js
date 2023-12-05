const data = require('fs').readFileSync("./21-2.txt", "utf8");
const input = data.split("\n").filter(line => line.length > 0);

const monkeys = {};

class Monkey {
  constructor (name, rule) {
    this.name = name;
    this.rule = rule;
    this.involved = false
  }

  yell() {
    this.involved = true;

    const [l, o, r] = this.rule.split(" ");

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

console.log(monkeys.root.yell());
console.log(Object.values(monkeys).filter(m => m.involved).length);
