const fs = require('fs')

const data = fs.readFileSync('./7-2.txt', 'utf8');
let input = data.split("\n");

let currentDir = "/";
const dirSize = {};

input.forEach(line => {
  if (line.length <= 0) return;

  if (line.startsWith("$")) {
    const [_, cmd, param] = line.split(" ");
    if (cmd === "cd") {
      if (param === "/") {
        currentDir = "/";
      } else if (param === "..") {
        currentDir = currentDir.split("/").slice(0, -1).join("/");
      } else {
        currentDir = [currentDir, param].join("/");
      }
    } else if (cmd === "ls") {
      return;
    } else throw new Error(`Wrong command ${cmd}: ${line}`);
  } else {
    if (line.startsWith("dir")) return;

    const [size, name] = line.split(" ");
    let dir = "";
    currentDir.split("/").forEach(d => {
      dir = [dir, d].join("/");
      dirSize[dir] = dirSize[dir] || 0;
      dirSize[dir] += parseInt(size);
    })
  }
})

const requiredToFreeup = 30000000 - (70000000 - dirSize["//"]);
// console.log(requiredToFreeup)
console.log(Object.values(dirSize).sort((a, b) => a - b).find(e => e >= requiredToFreeup))
