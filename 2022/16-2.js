const fs = require('fs');

const data = fs.readFileSync('./16-2.txt', 'utf8');
let input = data.split("\n").filter(line => line.length > 0);

const valves = [];
input.forEach(line => {
  const [_1, id, rate, _2, tunnels] = line.match(/Valve (\w+) has flow rate=(\d+); (tunnels lead to valves|tunnel leads to valve) ((\w+)(, \w+)*)/)
  valves[id] = { rate: parseInt(rate), tunnels: tunnels.split(",").map(e => e.trim()), time: {} };
})

let maxReleasing = 0;
let maxPath = undefined;
step(["AA", "AA"], [27, 27], 0, [[], []], []);

console.log(maxReleasing, maxPath.map(path => path.join(" ")).join(" - "));

function step([id1, id2], [time1, time2], totalReleasing, [path1, path2], open) {
  const hash1 = path1.filter(e => e < "aa").join("-");
  const hash2 = path2.filter(e => e < "aa").join("-");

  const valve1 = valves[id1];
  const valve2 = valves[id2];

  if (time1 <= 0 && time2 <= 0) return;

  if (time1 < valve1.time[hash1]) return;
  valve1.time[hash1] = time1;

  if (time2 < valve2.time[hash2]) return;
  valve2.time[hash2] = time2;

  const potential1 = Object.entries(valves).reduce((sum, [id, volve]) => sum + (open.includes(id) ? 0 : volve.rate * (time1 - 2)), 0);
  if (totalReleasing + potential1 < maxReleasing) {
    return;
  }

  const potential2 = Object.entries(valves).reduce((sum, [id, volve]) => sum + (open.includes(id) ? 0 : volve.rate * (time2 - 2)), 0);
  if (totalReleasing + potential2 < maxReleasing) {
    return;
  }

  {
    const [nextKeys1, nextTime1, nextPath1] = processGoThrough(id1, time1, path1);
    nextKeys1.forEach(nextKey1 => {
      {
        const [nextKeys2, nextTime2, nextPath2] = processGoThrough(id2, time2, path2);
        nextKeys2.forEach(nextKey2 => {
          step([nextKey1, nextKey2], [nextTime1, nextTime2], totalReleasing, [nextPath1, nextPath2], open);
        })
      }

      {
        const [nextKeys2, nextTime2, releasing2, nextPath2] = processOpenAndGo(id2, time2, path2, open);
        nextKeys2.forEach(nextKey2 => {
          if (totalReleasing + releasing2 > maxReleasing) {
            maxReleasing = totalReleasing + releasing2;
            maxPath = [[...nextPath1], [...nextPath2]];
            const p = Object.keys(valves).filter(key => valves[key].rate > 0 && !open.includes(key));
            console.log(maxReleasing, p.join(" "), ":", maxPath.map(path => path.join(" ")).join(" - "));
          }

          step([nextKey1, nextKey2], [nextTime1, nextTime2], totalReleasing + releasing2, [nextPath1, nextPath2], [...open, id2]);
        })
      }
    })
  }

  {
    const [nextKeys1, nextTime1, releasing1, nextPath1] = processOpenAndGo(id1, time1, path1, open);

    if (totalReleasing + releasing1 > maxReleasing) {
      maxReleasing = totalReleasing + releasing1;
      maxPath = [[...nextPath1], [...path2]];
      const p = Object.keys(valves).filter(key => valves[key].rate > 0 && !open.includes(key));
      console.log(maxReleasing, p.join(" "), ":", maxPath.map(path => path.join(" ")).join(" - "));
    }

    nextKeys1.forEach(nextKey1 => {
      {
        const [nextKeys2, nextTime2, nextPath2] = processGoThrough(id2, time2, path2);
        nextKeys2.forEach(nextKey2 => {
          step([nextKey1, nextKey2], [nextTime1, nextTime2], totalReleasing + releasing1, [nextPath1, nextPath2], [...open, id1]);
        })
      }

      {
        const [nextKeys2, nextTime2, releasing2, nextPath2] = processOpenAndGo(id2, time2, path2, [...open, id1]);
        nextKeys2.forEach(nextKey2 => {
          if (totalReleasing + releasing1 + releasing2 > maxReleasing) {
            maxReleasing = totalReleasing + releasing1 + releasing2;
            maxPath = [[...nextPath1], [...nextPath2]];
            const p = Object.keys(valves).filter(key => valves[key].rate > 0 && !open.includes(key));
            console.log(maxReleasing, p.join(" "), ":", maxPath.map(path => path.join(" ")).join(" - "));
          }

          step([nextKey1, nextKey2], [nextTime1, nextTime2], totalReleasing + releasing1 + releasing2, [nextPath1, nextPath2], [...open, id1, id2]);
        })
      }
    })
  }
}

function processGoThrough(id, time, path) {
  const nextPath = [...path, id.toLowerCase()];
  const valve = valves[id];

  if (time <= 0) {
    return [[], time-1, nextPath];
  }

  return [valve.tunnels, time-1, nextPath];
}

function processOpenAndGo(id, time, path, open) {
  const valve = valves[id];

  if (time > 0 && valve.rate > 0 && !open.includes(id)) {
    const releasing = (time - 2) * valve.rate;

    return [valve.tunnels, time - 2, releasing, [...path, id]];
  }

  return [[], time - 2, 0, [...path, id]];
}
