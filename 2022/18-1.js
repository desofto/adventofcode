const data = require('fs').readFileSync("./18-2.txt", "utf8");
const input = data.split("\n").filter(line => line.length > 0);

const cubes = input.map(line => ({ coords: line.split(",").map(e => parseInt(e)), sides: 6 }));

cubes.forEach(cube1 => {
  cubes.forEach(cube2 => {
    if (cube1 === cube2) return;

    if (cube1.coords[0] === cube2.coords[0] && cube1.coords[1] === cube2.coords[1] && Math.abs(cube1.coords[2] - cube2.coords[2]) === 1) cube1.sides--;
    if (cube1.coords[0] === cube2.coords[0] && cube1.coords[2] === cube2.coords[2] && Math.abs(cube1.coords[1] - cube2.coords[1]) === 1) cube1.sides--;
    if (cube1.coords[1] === cube2.coords[1] && cube1.coords[2] === cube2.coords[2] && Math.abs(cube1.coords[0] - cube2.coords[0]) === 1) cube1.sides--;
  })
})

console.log(cubes.reduce((sum, cube) => sum + cube.sides, 0));
