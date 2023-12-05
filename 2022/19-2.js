const { abort } = require('process');
// 1401 < 1449 <
const data = require('fs').readFileSync("./19-2.txt", "utf8");
const input = data.split("\n").slice(0,3).filter(line => line.length > 0);

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

blueprints.forEach(blueprint => {
  blueprint.qualityLevel = play(32, [blueprint]);
  console.log("!!! ", blueprint.id, blueprint.qualityLevel)
})

// console.log(blueprints);
console.log(blueprints.reduce((mul, blueprint) => mul * blueprint.qualityLevel, 1));

function play(step, blueprints) {
  if (step === 0) return Math.max(...blueprints.map(blueprint => blueprint.currency[3]));

  const results = [];
  blueprints.forEach(blueprint => {
    const currencyCopy = [...blueprint.currency];
    blueprint.robots.forEach((amount, currency) => blueprint.currency[currency] += amount);

    blueprint.cost.forEach((cost, robotType) => {
      if (cost.find((amount, currency) => amount > currencyCopy[currency])) return;
      if (robotType < 3 && blueprint.robots[robotType] >= Math.max(blueprint.cost[0][robotType], blueprint.cost[1][robotType], blueprint.cost[2][robotType], blueprint.cost[3][robotType])) return;

      const currency = [...blueprint.currency];
      cost.forEach((amount, curr) => {
        currency[curr] -= amount;
      })
      const robots = [...blueprint.robots];
      robots[robotType]++;

      results.push({ ...blueprint, currency, robots });
    })

    results.push({ ...blueprint, currency: [...blueprint.currency], robots: [...blueprint.robots] });
  })
  results.forEach(blueprint => {
    blueprint.value = value(blueprint);
  });
  results.sort((a, b) => b.value - a.value);

  return play(step-1, results.slice(0, 10000));
}

function value(blueprint) {
  return [
    (blueprint.currency[0] + blueprint.robots[0]) * 1,
    (blueprint.currency[1] + blueprint.robots[1]) * blueprint.cost[1][0],
    (blueprint.currency[2] + blueprint.robots[2]) * (blueprint.cost[2][0] + blueprint.cost[2][1] * blueprint.cost[1][0]),
    (blueprint.currency[3] + blueprint.robots[3]) * (blueprint.cost[3][0] + blueprint.cost[3][2] * blueprint.cost[2][1] * blueprint.cost[1][0]),
  ].reduce((sum, el) => sum + el, 0);
}
