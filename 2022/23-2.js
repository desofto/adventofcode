const data = require('fs').readFileSync("./23-2.txt", "utf8");
const input = data.split("\n").filter(line => line.length > 0);

const NORTH = 0;
const SOUTH = 1;
const WEST = 2;
const EAST = 3;

class Elf {
  static elves = [];
  static map = [];

  static minX = undefined;
  static maxX = undefined;
  static minY = undefined;
  static maxY = undefined;

  static isEmpty(x, y) {
    const yy = y - Elf.minY;
    if (yy < 0 || yy > Elf.map.length-1) return true;

    const row = Elf.map[yy];
    const xx = x - Elf.minX;
    if (xx < 0 || xx > row.length-1) return true;

    return row[xx] === ".";
  }

  static round() {
    Elf.prepareMap();
    Elf.elves.forEach(elf => elf.prepare());
    Elf.elves.forEach(elf => elf.validate());
    Elf.elves.forEach(elf => elf.step());
    Elf.elves.forEach(elf => elf.firstDirection = (elf.firstDirection + 1) % 4);
    // Elf.prepareMap();
  }

  static moved() {
    return Elf.elves.reduce((sum, elf) => sum + (elf.moved ? 1 : 0), 0);
  }

  static prepareMap() {
    let minX, maxX, minY, maxY;

    Elf.elves.forEach(elf => {
      if (minX === undefined || elf.x < minX) minX = elf.x;
      if (maxX === undefined || elf.x > maxX) maxX = elf.x;
      if (minY === undefined || elf.y < minY) minY = elf.y;
      if (maxY === undefined || elf.y > maxY) maxY = elf.y;
    });
    Elf.minX = minX;
    Elf.maxX = maxX;
    Elf.minY = minY;
    Elf.maxY = maxY;

    Elf.map = [];
    for (let y = minY; y <= maxY; y++) {
      const line = [];
      for (let x = minX; x <= maxX; x++) {
        if (Elf.elves.find(elf => elf.x === x && elf.y === y)) line.push("#"); else line.push(".");
      }
      Elf.map.push(line);
    }
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
    if (this.nx === undefined || this.ny === undefined) return;

    let found = false;

    Elf.elves.forEach(elf => {
      if (elf === this) return;
      if (elf.nx === undefined || elf.ny === undefined) return;

      if (elf.nx === this.nx && elf.ny === this.ny) {
        elf.nx = undefined;
        elf.ny = undefined;
        found = true;
      }
    });

    if (found) {
      this.nx = undefined;
      this.ny = undefined;
    }
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

  console.log(round, Elf.moved());
  // print();

  round++;
} while (Elf.moved());

function print() {
  Elf.map.forEach(row => {
    console.log(row.join(""));
  })
  console.log((Elf.maxY - Elf.minY + 1) * (Elf.maxX - Elf.minX + 1) - Elf.elves.length);
  console.log();
}
