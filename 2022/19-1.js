const data = require('fs').readFileSync("./19-1.txt", "utf8");
const input = data.split("\n").filter(line => line.length > 0);

/*
2,9,0,0 + 1,3,0,0 => 3,12,0,0 + 1,3,0,0 => 4,15,0,0 - 3,14,0,0 + 1,3,0,0 => 2,4,1,0
0,0,-7,0 : -1,-5,0,0 : 0,0,0,0 => 0,0,-7,0 : 0,-2,0,0 : 0,0,0,0
2, 4,  0,   0 => 10
1, 2,  0,   0 => 5

1, 6,  0,   0 => 13
1, 3,  0,   0 => 7

2, 9,  0,   0 => 20
1, 3,  0,   0 => 7

>
3,12,  0,   0 => 27
1, 3,  0,   0 => 7

4,15,  0,   0 => 34
1, 3,  0,   0 => 7

5,18,  0,   0 => 41
1, 3,  0,   0 => 7

2, 4,  0,   0 => 10
1, 3,  1,   0 => 38

>
1,12,  0,   0 => 25
1, 4,  0,   0 => 9

2,16,  0,   0 => 34
1, 4,  0,   0 => 9

1,20,  0,   0 => 41
1, 5,  0,   0 => 11

2,25,  0,   0 => 52
1, 5,  0,   0 => 11

1, 2, 31, 219


2,9,0,0 - 2,0,0,0 + 1,3,0,0 => 1,12,0,0 + 1,4,0,0 => 2,16,0,0
0,0,-7,0 : -1,-5,0,0 : 0,0,0,0 => -1,0,-7,0 : -2,-2,0,0

*/


const blueprints = [];
input.forEach(line => {
  const [_1, id, oreRobotCostOre, clayRobotCostOre, obsidianRobotCostOre, obsidianRobotCostClay, geodeRobotCostOre, geodeRobotCostObsidian] = line.match(/Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./);
  blueprints.push({
    id: Number(id),
    currency: [0, 0, 0, 0],
    robots: [1, 0, 0, 0],
    cost: [
      [ Number(oreRobotCostOre), 0, 0, 0 ],
      [ Number(clayRobotCostOre), 0, 0, 0 ],
      [ Number(obsidianRobotCostOre), Number(obsidianRobotCostClay), 0, 0 ],
      [ Number(geodeRobotCostOre), 0, Number(geodeRobotCostObsidian), 0 ],
    ],
    qualityLevel: 0
  })
})

for (let i = 1; i <= 24; i++) {
  blueprints.forEach(blueprint => {
    const currencyCopy = [...blueprint.currency];

    blueprint.robots.forEach((amount, currency) => blueprint.currency[currency] += amount);

    [...blueprint.cost].reverse().forEach((cost, rt) => {
      const robotType = 3 - rt;
      if (cost.find((amount, currency) => amount > currencyCopy[currency])) return;
      // if (blueprint.robots[robotType] >= Math.max(blueprint.cost[0][robotType], blueprint.cost[1][robotType], blueprint.cost[1][robotType], blueprint.cost[2][robotType])) return;

      switch (robotType) {
        case 0:
          if (blueprint.robots[0] >= 2) return;
          // if (blueprint.robots[0] > blueprint.robots[1] * blueprint.cost[1][0] / blueprint.cost[0][0]);
          // if (blueprint.id === 2) {
            // console.log(`(Math.max(0, (${blueprint.currency[0]} - ${blueprint.cost[1][0]}) / ${blueprint.robots[0]}) - Math.max(0, (${blueprint.currency[0]} - ${blueprint.cost[0][0]}) / ${blueprint.robots[0]})`);
          // }
          // if (blueprint.robots[0] >= Math.max(blueprint.cost[0][0], blueprint.cost[1][0], blueprint.cost[2][0], blueprint.cost[3][0])) return;
          // if (Math.max(0, (blueprint.currency[0] - blueprint.cost[1][0]) / blueprint.robots[0]) - Math.max(0, (blueprint.currency[0] - blueprint.cost[0][0]) / blueprint.robots[0]) < 2) return;
          // if (
          //   Math.max(0, (blueprint.cost[2][0] - blueprint.currency[0]) / blueprint.robots[0]) - Math.max(0, (blueprint.cost[2][1] - blueprint.currency[1]) / blueprint.robots[1]) < 2 &&
          //   Math.max(0, (blueprint.cost[3][0] - blueprint.currency[0]) / blueprint.robots[0]) - Math.max(0, (blueprint.cost[3][2] - blueprint.currency[2]) / blueprint.robots[2]) < 2
          // ) return;
          break;
        case 1:
          if (blueprint.robots[1] >= 2) return;
          if (blueprint.robots[1] > 0 && Math.max(0, (blueprint.cost[2][1] - blueprint.currency[1]) / blueprint.robots[1]) - Math.max(0, (blueprint.cost[2][0] - blueprint.currency[0]) / blueprint.robots[0]) < 2) return;
          break;
        case 2:
          if (blueprint.robots[2] > 0 && Math.max(0, (blueprint.cost[3][2] - blueprint.currency[2]) / blueprint.robots[2]) - Math.max(0, (blueprint.cost[3][0] - blueprint.currency[0]) / blueprint.robots[0]) < 2) return;
          break;
        case 3:
          break;
      }

      cost.forEach((amount, currency) => {
        blueprint.currency[currency] -= amount;
        currencyCopy[currency] -= amount;
      })

      blueprint.robots[robotType]++;
    })

    blueprint.qualityLevel = blueprint.id * blueprint.currency[3];
  })

  console.log(i, blueprints)
}

console.log(blueprints.reduce((sum, blueprint) => sum + blueprint.qualityLevel, 0))
