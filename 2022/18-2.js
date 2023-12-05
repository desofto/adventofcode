const data = require('fs').readFileSync("./18-2.txt", "utf8");
const input = data.split("\n").filter(line => line.length > 0);

// 2022 > < 3236

const cubes = input.map(line => ({ coords: line.split(",").map(e => parseInt(e)), sides: 0 }));

// cubes.forEach(cube1 => {
//   cubes.forEach(cube2 => {
//     if (cube1 === cube2) return;

//     if (cube1.coords[0] === cube2.coords[0] && cube1.coords[1] === cube2.coords[1] && Math.abs(cube1.coords[2] - cube2.coords[2]) === 1) cube1.sides--;
//     if (cube1.coords[0] === cube2.coords[0] && cube1.coords[2] === cube2.coords[2] && Math.abs(cube1.coords[1] - cube2.coords[1]) === 1) cube1.sides--;
//     if (cube1.coords[1] === cube2.coords[1] && cube1.coords[2] === cube2.coords[2] && Math.abs(cube1.coords[0] - cube2.coords[0]) === 1) cube1.sides--;
//   })
// })

const min0 = Math.min(...cubes.map(cube => cube.coords[0]));
const max0 = Math.max(...cubes.map(cube => cube.coords[0]));

const min1 = Math.min(...cubes.map(cube => cube.coords[1]));
const max1 = Math.max(...cubes.map(cube => cube.coords[1]));

const min2 = Math.min(...cubes.map(cube => cube.coords[2]));
const max2 = Math.max(...cubes.map(cube => cube.coords[2]));

const air = [];

for (let x = min0; x <= max0; x++) {
  for (let y = min1; y <= max1; y++) {
    for (let z = min2; z <= max2; z++) {
      if (cubes.find(cube => cube.coords[0] === x && cube.coords[1] === y && cube.coords[2] === z)) continue;
      air.push({ coords: [x, y, z], internal: true });
    }
  }
}

air.forEach(airUnit => {
  const [x, y, z] = airUnit.coords;

  if (!cubes.find(cube => (cube.coords[0] < x) && cube.coords[1] === y && cube.coords[2] === z)) airUnit.internal = false;
  if (!cubes.find(cube => (cube.coords[0] > x) && cube.coords[1] === y && cube.coords[2] === z)) airUnit.internal = false;
  if (!cubes.find(cube => (cube.coords[1] < y) && cube.coords[0] === x && cube.coords[2] === z)) airUnit.internal = false;
  if (!cubes.find(cube => (cube.coords[1] > y) && cube.coords[0] === x && cube.coords[2] === z)) airUnit.internal = false;
  if (!cubes.find(cube => (cube.coords[2] < z) && cube.coords[0] === x && cube.coords[1] === y)) airUnit.internal = false;
  if (!cubes.find(cube => (cube.coords[2] > z) && cube.coords[0] === x && cube.coords[1] === y)) airUnit.internal = false;
})

let changed;
do {
  changed = false;

  air.forEach(airUnit => {
    if (!airUnit.internal) return;

    const [x, y, z] = airUnit.coords;

    if (air.find(airUnit => !airUnit.internal && (airUnit.coords[0] === x-1) && airUnit.coords[1] === y && airUnit.coords[2] === z)) airUnit.internal = false;
    if (air.find(airUnit => !airUnit.internal && (airUnit.coords[0] === x+1) && airUnit.coords[1] === y && airUnit.coords[2] === z)) airUnit.internal = false;
    if (air.find(airUnit => !airUnit.internal && (airUnit.coords[1] === y-1) && airUnit.coords[0] === x && airUnit.coords[2] === z)) airUnit.internal = false;
    if (air.find(airUnit => !airUnit.internal && (airUnit.coords[1] === y+1) && airUnit.coords[0] === x && airUnit.coords[2] === z)) airUnit.internal = false;
    if (air.find(airUnit => !airUnit.internal && (airUnit.coords[2] === z-1) && airUnit.coords[0] === x && airUnit.coords[1] === y)) airUnit.internal = false;
    if (air.find(airUnit => !airUnit.internal && (airUnit.coords[2] === z+1) && airUnit.coords[0] === x && airUnit.coords[1] === y)) airUnit.internal = false;

    if (!airUnit.internal) changed = true;
  })
} while (changed);

cubes.forEach(cube => {
  const [x, y, z] = cube.coords;

  if (!cubes.find(cube => (cube.coords[0] === x-1) && cube.coords[1] === y && cube.coords[2] === z) && !air.find(airUnit => airUnit.internal && (airUnit.coords[0] === x-1) && airUnit.coords[1] === y && airUnit.coords[2] === z)) cube.sides++;
  if (!cubes.find(cube => (cube.coords[0] === x+1) && cube.coords[1] === y && cube.coords[2] === z) && !air.find(airUnit => airUnit.internal && (airUnit.coords[0] === x+1) && airUnit.coords[1] === y && airUnit.coords[2] === z)) cube.sides++;
  if (!cubes.find(cube => (cube.coords[1] === y-1) && cube.coords[0] === x && cube.coords[2] === z) && !air.find(airUnit => airUnit.internal && (airUnit.coords[1] === y-1) && airUnit.coords[0] === x && airUnit.coords[2] === z)) cube.sides++;
  if (!cubes.find(cube => (cube.coords[1] === y+1) && cube.coords[0] === x && cube.coords[2] === z) && !air.find(airUnit => airUnit.internal && (airUnit.coords[1] === y+1) && airUnit.coords[0] === x && airUnit.coords[2] === z)) cube.sides++;
  if (!cubes.find(cube => (cube.coords[2] === z-1) && cube.coords[0] === x && cube.coords[1] === y) && !air.find(airUnit => airUnit.internal && (airUnit.coords[2] === z-1) && airUnit.coords[0] === x && airUnit.coords[1] === y)) cube.sides++;
  if (!cubes.find(cube => (cube.coords[2] === z+1) && cube.coords[0] === x && cube.coords[1] === y) && !air.find(airUnit => airUnit.internal && (airUnit.coords[2] === z+1) && airUnit.coords[0] === x && airUnit.coords[1] === y)) cube.sides++;
});

// console.log(air)
// console.log(cubes)
console.log(cubes.reduce((sum, cube) => sum + cube.sides, 0));
console.log(air.length, air.filter(airUnit => airUnit.internal).length);
