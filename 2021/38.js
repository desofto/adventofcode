// https://adventofcode.com/2021/day/21

const pos = [7, 10]
const score = [0, 0]

let die = 0
let player = 0
let turnCount = 0

while (score[0] < 1000 && score[1] < 1000) {
  pos[player] += roll() + roll() + roll()
  pos[player] = 1 + (pos[player] - 1) % 10
  score[player] += pos[player]
  player = 1 - player
}

console.log(score[player] * turnCount)

function roll() {
  turnCount++
  return ++die
}
