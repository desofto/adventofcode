const data = require('fs').readFileSync("./23-2.txt", "utf8");
const input = data.split("\n").filter(line => line.length > 0);

const NORTH = 0;
const SOUTH = 1;
const WEST = 2;
const EAST = 3;

class Elf {
  static elves = [];

  static isEmpty(x, y) {
    return !Elf.elves.find(elf => elf.x === x && elf.y === y);
  }

  static round() {
    Elf.elves.forEach(elf => elf.prepare());
    Elf.elves.forEach(elf => elf.validate());
    Elf.elves.forEach(elf => elf.step());
    Elf.elves.forEach(elf => elf.firstDirection = (elf.firstDirection + 1) % 4);
  }

  static moved() {
    return Elf.elves.filter(elf => elf.moved).length;
  }

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.firstDirection = NORTH;
  }

  prepare(direction) {
    if (direction === undefined) {
      this.moved = false;
      this.nx = undefined;
      this.ny = undefined;

      if (
        Elf.isEmpty(this.x-1, this.y-1) && Elf.isEmpty(this.x, this.y-1) && Elf.isEmpty(this.x+1, this.y-1) &&
        Elf.isEmpty(this.x-1, this.y) && Elf.isEmpty(this.x+1, this.y) &&
        Elf.isEmpty(this.x-1, this.y+1) && Elf.isEmpty(this.x, this.y+1) && Elf.isEmpty(this.x+1, this.y+1)
      ) {
        return;
      }

      if (this.prepare((this.firstDirection + 0) % 4)) return;
      if (this.prepare((this.firstDirection + 1) % 4)) return;
      if (this.prepare((this.firstDirection + 2) % 4)) return;
      if (this.prepare((this.firstDirection + 3) % 4)) return;
    } else {
      switch (direction) {
        case NORTH:
          if (Elf.isEmpty(this.x-1, this.y-1) && Elf.isEmpty(this.x, this.y-1) && Elf.isEmpty(this.x+1, this.y-1)) {
            this.nx = this.x;
            this.ny = this.y-1;
            return true;
          }
          break;
        case SOUTH:
          if (Elf.isEmpty(this.x-1, this.y+1) && Elf.isEmpty(this.x, this.y+1) && Elf.isEmpty(this.x+1, this.y+1)) {
            this.nx = this.x;
            this.ny = this.y+1;
            return true;
          }
          break;
        case WEST:
          if (Elf.isEmpty(this.x-1, this.y-1) && Elf.isEmpty(this.x-1, this.y) && Elf.isEmpty(this.x-1, this.y+1)) {
            this.nx = this.x-1;
            this.ny = this.y;
            return true;
          }
          break;
        case EAST:
          if (Elf.isEmpty(this.x+1, this.y-1) && Elf.isEmpty(this.x+1, this.y) && Elf.isEmpty(this.x+1, this.y+1)) {
            this.nx = this.x+1;
            this.ny = this.y;
            return true;
          }
          break;
      }
    }
  }

  step() {
    if (this.nx !== undefined && this.ny !== undefined) {
      this.x = this.nx;
      this.y = this.ny;
      this.moved = true;
    }
  }

  validate() {
    Elf.elves.forEach(elf => {
      if (elf.nx === undefined || elf.ny === undefined) return;

      let found = false;

      Elf.elves.forEach(elf2 => {
        if (elf2 === elf) return;
        if (elf2.nx === undefined || elf2.ny === undefined) return;
        if (elf2.nx === elf.nx && elf2.ny === elf.ny) {
          elf2.nx = undefined;
          elf2.ny = undefined;
          found = true;
        }
      });

      if (found) {
        elf.nx = undefined;
        elf.ny = undefined;
      }
    })
  }
}

input.forEach((line, y) => {
  line.split("").forEach((el, x) => {
    if (el === "#") {
      Elf.elves.push(new Elf(x, y));
    }
  });
});

let round = 1;
do {
  Elf.round();

  console.log(round);
  print();

  round++;
} while (round <= 10 && Elf.moved());

function print() {
  let minX, maxX, minY, maxY;

  Elf.elves.forEach(elf => {
    if (minX === undefined || elf.x < minX) minX = elf.x;
    if (maxX === undefined || elf.x > maxX) maxX = elf.x;
    if (minY === undefined || elf.y < minY) minY = elf.y;
    if (maxY === undefined || elf.y > maxY) maxY = elf.y;
  });

  for (let y = minY; y <= maxY; y++) {
    let s = "";
    for (let x = minX; x <= maxX; x++) {
      if (Elf.isEmpty(x, y)) s += "."; else s += "#";
    }
    console.log(s);
  }
  console.log((maxY - minY + 1) * (maxX - minX + 1) - Elf.elves.length);
  console.log();
}
