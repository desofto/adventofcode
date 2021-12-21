// https://adventofcode.com/2021/day/21

const ROLLS = {
  3: 1,
  4: 3,
  5: 6,
  6: 7,
  7: 6,
  8: 3,
  9: 1
}

const wins = [0, 0]

let iterations = 0

function turn(player, pos, score, cnt) {
  iterations++
  Object.entries(ROLLS).forEach(([roll, count]) => {
    roll = parseInt(roll)

    const _pos = [...pos]
    const _score = [...score]
    _pos[player] += roll
    _pos[player] = 1 + (_pos[player] - 1) % 10
    _score[player] += _pos[player]
    if (_score[player] >= 21) {
      wins[player] += cnt*count
      if (iterations % 1000000 === 0) {
        console.log(">", wins, iterations)
      }
    } else {
      turn(1 - player, _pos, _score, cnt*count)
    }

  })
}

turn(0, [7, 10], [0, 0], 1)
console.log(">", wins, iterations)

