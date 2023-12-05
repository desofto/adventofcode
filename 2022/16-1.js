const fs = require('fs');

const data = fs.readFileSync('./16-2.txt', 'utf8');
let input = data.split("\n").filter(line => line.length > 0);

const valves = [];
input.forEach(line => {
  const [_1, id, rate, _2, tunnels] = line.match(/Valve (\w+) has flow rate=(\d+); (tunnels lead to valves|tunnel leads to valve) ((\w+)(, \w+)*)/)
  valves[id] = { rate: parseInt(rate), tunnels: tunnels.split(",").map(e => e.trim()), time: {}, visited: [] };
})

let maxReleasing = 0;
let maxPath = undefined;
step("AA", 31, 0, [], []);

console.log(maxReleasing, maxPath.join(" "));

function step(id, time, totalReleasing, path, open) {
  if (time <= 0) {
    return;
  }

  const valve = valves[id];

  const hash0 = open.join("-");
  if (time < valve.time[hash0]) return;
  valve.time[hash0] = time;

  const potential = Object.entries(valves).reduce((sum, [id, volve]) => sum + (open.includes(id) ? 0 : volve.rate * (time - 2)), 0);
  if (totalReleasing + potential < maxReleasing) {
    return;
  }

  const hash = [...open, time].join("-");
  if (valve.visited.includes(hash)) return;
  valve.visited.push(hash);

  if (path.reduce((count, key) => count + (key === id ? 1 : 0), 0) > valve.tunnels.length) return;

  const nextPath = [...path, id.toLowerCase()];
  const nextOpen = [...open];
  valve.tunnels.forEach(key => {
    step(key, time - 1, totalReleasing, nextPath, nextOpen);
  });

  if (valve.rate > 0 && !open.includes(id)) {
    const releasing = (time - 2) * valve.rate;

    if (totalReleasing + releasing > maxReleasing) {
      maxReleasing = totalReleasing + releasing;
      maxPath = [...path, id];
      const p = Object.keys(valves).filter(key => valves[key].rate > 0 && !open.includes(key));
      console.log(maxReleasing, potential, p.join(" "), ":", id, valve.rate, releasing, maxPath.join(" "));
    }

    const nextPath = [...path, id];
    const nextOpen = [...open, id];
    valve.tunnels.forEach(key => {
      step(key, time - 2, totalReleasing + releasing, nextPath, nextOpen);
    });
  }
}
