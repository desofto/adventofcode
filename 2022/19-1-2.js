const { abort } = require('process');
// 1401 < 1449 <
const data = require('fs').readFileSync("./19-2.txt", "utf8");
const input = data.split("\n").filter(line => line.length > 0);

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

let Max = {};
let Best = {};

blueprints.forEach(blueprint => {
  Max = {};
  Best = {};
  blueprint.qualityLevel = Math.max(play(24, blueprint), 0);
  console.log("!!! ", blueprint.id, blueprint.qualityLevel)
})

console.log(blueprints);
console.log(blueprints.reduce((sum, blueprint) => sum + blueprint.qualityLevel * blueprint.id, 0));

function play(step, blueprint) {
  if (step === 0) {
    Best[blueprint.id] = Math.max(Best[blueprint.id] || 0, blueprint.currency[3]);
    return blueprint.currency[3];
  }

  if (blueprint.currency[3]) {
    if (steps(Best[blueprint.id] - blueprint.currency[3], blueprint.robots[3]) > step) return -1;
  } else if (blueprint.currency[2]) {
    if (steps(blueprint.cost[3][2] - blueprint.currency[2], blueprint.robots[2]) + steps(Best[blueprint.id], 0) > step) return -1;
  } else if (blueprint.currency[1]) {
    if (steps(blueprint.cost[2][1] - blueprint.currency[1], blueprint.robots[1]) + steps(blueprint.cost[3][2], 0) + steps(Best[blueprint.id], 0) > step) return -1;
  } else {
    if (steps(blueprint.cost[1][0] - blueprint.currency[0], blueprint.robots[0]) + steps(blueprint.cost[2][1], 0) + steps(blueprint.cost[3][2], 0) + steps(Best[blueprint.id], 0) > step) return -1;
  }
  const hash = [...blueprint.currency, blueprint.robots, step].join(":");

  if (Max[hash]) return Max[hash];

  const results = [];

  const currencyCopy = [...blueprint.currency];

  // const val = value(blueprint);

  blueprint.robots.forEach((amount, currency) => blueprint.currency[currency] += amount);

  // const val2 = value(blueprint);
  // if (val2 < Values[step]) return -1;
  // Values[step] = val;

  [...blueprint.cost].reverse().forEach((cost, rt) => {
    const robotType = 3 - rt;
    if (cost.find((amount, currency) => amount > currencyCopy[currency])) return;
    if (robotType < 3 && blueprint.robots[robotType] >= Math.max(blueprint.cost[0][robotType], blueprint.cost[1][robotType], blueprint.cost[2][robotType], blueprint.cost[3][robotType])) return;

    const currency = [...blueprint.currency];
    cost.forEach((amount, curr) => {
      currency[curr] -= amount;
    })
    const robots = [...blueprint.robots];
    robots[robotType]++;

    results.push(play(step - 1, { ...blueprint, currency, robots }));
  })

  results.push(play(step - 1, { ...blueprint, currency: [...blueprint.currency], robots: [...blueprint.robots] }));

  if (step > 15) console.log(blueprint.id, Best[blueprint.id], step, Object.keys(Max).length, results);
  Max[hash] = Math.max(...results);
  return Math.max(...results);
}

function value(blueprint) {
  return [
    (blueprint.currency[0] + blueprint.robots[0]) * 1,
    (blueprint.currency[1] + blueprint.robots[1]) * blueprint.cost[1][0],
    (blueprint.currency[2] + blueprint.robots[2]) * (blueprint.cost[2][0] + blueprint.cost[2][1] * blueprint.cost[1][0]),
    (blueprint.currency[3] + blueprint.robots[3]) * (blueprint.cost[3][0] + blueprint.cost[3][2] * blueprint.cost[2][1] * blueprint.cost[1][0]),
  ].reduce((sum, el) => sum + el, 0);
}

function steps(remain, robots) {
  let steps = 0;
  while (remain > robots) {
    robots++;
    remain -= robots;
    steps++;
  }
  return steps;
}
