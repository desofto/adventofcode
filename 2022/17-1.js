const fs = require('fs');

const data = fs.readFileSync('./17-2.txt', 'utf8');
const input = data.split("\n").filter(line => line.length > 0);
const jet = input[0].split("");

const units = [];

function isEmpty(x, y) {
  return !units.slice(-100).find(unit => unit.cross(x, y));
}

class Unit {
  constructor(type, y) {
    this.type = type;
    this.x = 2;
    this.y = y;
  }

  cross(x, y) {
    if (this.type === 1) {
      return y === this.y && x >= this.x && x <= this.x + 3;
    }

    if (this.type === 2) {
      return (y === this.y && x === this.x + 1) ||
             (y === this.y + 1 && x >= this.x && x <= this.x + 2) ||
             (y === this.y + 2 && x === this.x + 1);
    }

    if (this.type === 3) {
      return (y === this.y && x >= this.x && x <= this.x + 2) ||
             (y === this.y + 1 && x === this.x + 2) ||
             (y === this.y + 2 && x === this.x + 2);
    }

    if (this.type === 4) {
      return (y === this.y && x === this.x) ||
             (y === this.y + 1 && x === this.x) ||
             (y === this.y + 2 && x === this.x) ||
             (y === this.y + 3 && x === this.x);
    }

    if (this.type === 5) {
      return (y >= this.y && y <= this.y + 1 && x >= this.x && x <= this.x + 1);
    }
  }

  jetLeft() {
    if (this.type === 1) {
      if (this.x > 0 && isEmpty(this.x - 1, this.y)) {
        this.x--;
      }
    }

    if (this.type === 2) {
      if (this.x > 0 && isEmpty(this.x, this.y) && isEmpty(this.x - 1, this.y + 1) && isEmpty(this.x, this.y + 2)) {
        this.x--;
      }
    }

    if (this.type === 3) {
      if (this.x > 0 && isEmpty(this.x - 1, this.y) && isEmpty(this.x + 1, this.y + 1) && isEmpty(this.x + 1, this.y + 2)) {
        this.x--;
      }
    }

    if (this.type === 4) {
      if (this.x > 0 && isEmpty(this.x - 1, this.y) && isEmpty(this.x - 1, this.y + 1) && isEmpty(this.x - 1, this.y + 2) && isEmpty(this.x - 1, this.y + 3)) {
        this.x--;
      }
    }

    if (this.type === 5) {
      if (this.x > 0 && isEmpty(this.x - 1, this.y) && isEmpty(this.x - 1, this.y + 1)) {
        this.x--;
      }
    }
  }

  jetRight() {
    if (this.type === 1) {
      if (this.x + 4 < 7 && isEmpty(this.x + 4, this.y)) {
        this.x++;
      }
    }

    if (this.type === 2) {
      if (this.x + 3 < 7 && isEmpty(this.x + 2, this.y) && isEmpty(this.x + 3, this.y + 1) && isEmpty(this.x + 2, this.y + 2)) {
        this.x++;
      }
    }

    if (this.type === 3) {
      if (this.x + 3 < 7 && isEmpty(this.x + 3, this.y) && isEmpty(this.x + 3, this.y + 1) && isEmpty(this.x + 3, this.y + 2)) {
        this.x++;
      }
    }

    if (this.type === 4) {
      if (this.x + 1 < 7 && isEmpty(this.x + 1, this.y) && isEmpty(this.x + 1, this.y + 1) && isEmpty(this.x + 1, this.y + 2) && isEmpty(this.x + 1, this.y + 3)) {
        this.x++;
      }
    }

    if (this.type === 5) {
      if (this.x + 2 < 7 && isEmpty(this.x + 2, this.y) && isEmpty(this.x + 2, this.y + 1)) {
        this.x++;
      }
    }
  }

  fall() {
    if (this.y <= 0) return;

    if (this.type === 1) {
      if (isEmpty(this.x, this.y-1) && isEmpty(this.x+1, this.y-1) && isEmpty(this.x+2, this.y-1) && isEmpty(this.x+3, this.y-1)) {
        this.y--;
        return true;
      }
    }

    if (this.type === 2) {
      if (isEmpty(this.x, this.y) && isEmpty(this.x + 1, this.y - 1) && isEmpty(this.x + 2, this.y)) {
        this.y--;
        return true;
      }
    }

    if (this.type === 3) {
      if (isEmpty(this.x, this.y - 1) && isEmpty(this.x + 1, this.y - 1) && isEmpty(this.x + 2, this.y - 1)) {
        this.y--;
        return true;
      }
    }

    if (this.type === 4) {
      if (isEmpty(this.x, this.y - 1)) {
        this.y--;
        return true;
      }
    }

    if (this.type === 5) {
      if (isEmpty(this.x, this.y - 1) && isEmpty(this.x + 1, this.y - 1)) {
        this.y--;
        return true;
      }
    }

    return false;
  }

  get top() {
    if (this.type === 1) {
      return this.y;
    }

    if (this.type === 2) {
      return this.y + 2;
    }

    if (this.type === 3) {
      return this.y + 2;
    }

    if (this.type === 4) {
      return this.y + 3;
    }

    if (this.type === 5) {
      return this.y + 1;
    }
  }
}

let unitType = 0;
let jetIndex = 0;

function nextUnitType() {
  unitType++;
  if (unitType > 5) unitType = 1;

  return unitType;
}

function nextJet() {
  if (jetIndex >= jet.length) jetIndex = 0;

  return jet[jetIndex++];
}

const heights = [];

let lastHeight = 0;
for (let i = 1; i <= 200000; i++) {
  if (i % 1000 === 0) console.log(i)
  const unit = new Unit(nextUnitType(), units.length > 0 ? units.reduce((max, unit) => Math.max(max, unit.top), 0) + 4 : 3);
  do {
    const j = nextJet();
    if (j === ">") unit.jetRight();
    if (j === "<") unit.jetLeft();
  } while (unit.fall());
  units.push(unit);
  const height = units.reduce((max, unit) => Math.max(max, unit.top+1), 0);
  heights[i] = height;
}
const height = units.reduce((max, unit) => Math.max(max, unit.top+1), 0);
console.log(height);

fs.writeFileSync("./17-2-2.json", JSON.stringify(heights))
