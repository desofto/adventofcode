// https://adventofcode.com/2021/day/23

const pool = ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.']

/*
const caves = [
  ['B', 'A'],
  ['C', 'D'],
  ['B', 'C'],
  ['D', 'A']
]
*/

const caves = [
  ['A', 'D'],
  ['C', 'D'],
  ['B', 'B'],
  ['A', 'C']
]

const EnergyConsumption = {
  'A': 1,
  'B': 10,
  'C': 100,
  'D': 1000,
}

let minEnergy = null
let minSteps = []

let iteration = 0

function turn(_energy, _pool, _caves, _steps) {
  let pool = [..._pool]
  let caves = _caves.map(cave => [...cave])
  let energy = _energy
  let steps = _steps.map(s => [...s])

  function push(from, to) {
    if (pool[to] !== '.') throw Error()
    let energy = 0
    let creature
    let deep
    if (caves[from][0] !== '.') {
      creature = caves[from][0]
      if (['A', 'B', 'C', 'D'].indexOf(creature) === from && ['A', 'B', 'C', 'D'].indexOf(caves[from][1]) === from) throw Error()
      deep = 0
      energy += 1 * EnergyConsumption[creature]
    } else if (caves[from][1] !== '.') {
      creature = caves[from][1]
      if (['A', 'B', 'C', 'D'].indexOf(creature) === from) throw Error()
      deep = 1
      energy += 2 * EnergyConsumption[creature]
    } else throw Error()
    let index = from * 2 + 2
    let dir = (to - index) / Math.abs(to - index)
    while (index !== to) {
      if (pool[index] !== '.') throw Error()
      energy += EnergyConsumption[creature]
      index += dir
    }
    caves[from][deep] = '.'
    pool[to] = creature
    return energy
  }

  function pop(from, to) {
    let energy = 0
    let creature = pool[from]
    if (['A', 'B', 'C', 'D'].indexOf(creature) !== to) throw Error()
    let deep
    if (caves[to][1] === '.') {
      deep = 1
      energy += 2 * EnergyConsumption[creature]
    } else if (caves[to][0] === '.') {
      if (caves[to][1] !== creature) throw Error()
      deep = 0
      energy += 1 * EnergyConsumption[creature]
    } else throw Error()
    let index = to * 2 + 2
    let dir = (from - index) / Math.abs(from - index)
    while (index !== from) {
      if (pool[index] !== '.') throw Error()
      energy += EnergyConsumption[creature]
      index += dir
    }
    pool[from] = '.'
    caves[to][deep] = creature
    return energy
  }

  function print() {
    console.log(energy, '->', minEnergy)
    console.log('#############')
    console.log('#' + pool.map(el => el).join('') + '#')
    console.log('###' + caves[0][0] + '#' + caves[1][0] + '#' + caves[2][0] + '#' + caves[3][0] + '###')
    console.log('  #' + caves[0][1] + '#' + caves[1][1] + '#' + caves[2][1] + '#' + caves[3][1] + '#  ')
    console.log('  #########  ')
    console.log(steps.slice(0, 3).join("\n"))
    console.log('----')
    console.log(minSteps.join("\n"))
    console.log('\n')
  }

  function check() {
    if (caves[0][0] !== 'A' || caves[0][1] !== 'A') return false
    if (caves[1][0] !== 'B' || caves[1][1] !== 'B') return false
    if (caves[2][0] !== 'C' || caves[2][1] !== 'C') return false
    if (caves[3][0] !== 'D' || caves[3][1] !== 'D') return false
    return true
  }

  function energyOver() {
    if (minEnergy) {
      let energyPotential = 0
      pool.forEach((creature, index) => {
        const target = ['A', 'B', 'C', 'D'].indexOf(creature)
        if (target < 0) return

        energyPotential += (1 + Math.abs(index - (target * 2 + 2))) * EnergyConsumption[creature]
      })

      return energy + energyPotential >= minEnergy
    }
  }

  if (energyOver()) return

  iteration++
  if (iteration % 1000 === 0) {
    print()
  }

  for (let cave = caves.length-1; cave >= 0; cave--) {
    if (caves[cave][0] !== '.') continue

    for (let index = pool.length-1; index >= 0; index--) {
      if (cave * 2 + 2 === index) continue
      if (pool[index] === '.') continue

      try {
        energy = _energy + pop(index, cave)
        steps.push(['pop', index, cave])

        if (check()) {
          if (!minEnergy || energy < minEnergy) {
            minEnergy = energy
            minSteps = steps.map(s => [...s])
            print()
          }
          return
        }

        if (!energyOver()) {
          turn(energy, pool, caves, steps)
        }

        pool = [..._pool]
        caves = _caves.map(cave => [...cave])
        steps = _steps.map(s => [...s])
      } catch (_) {}
    }
  }

  for (let cave = caves.length-1; cave >= 0; cave--) {
    if (caves[cave][1] === '.') continue

    for (let index = pool.length-1; index >= 0; index--) {
      if (cave * 2 + 2 === index) continue
      if (pool[index] !== '.') continue

      try {
        energy = _energy + push(cave, index)
        steps.push(['push', cave, index])

        if (!energyOver()) {
          turn(energy, pool, caves, steps)
        }

        pool = [..._pool]
        caves = _caves.map(cave => [...cave])
        steps = _steps.map(s => [...s])
      } catch (_) {}
    }
  }
}

turn(0, pool, caves, [])

console.log(minEnergy)
