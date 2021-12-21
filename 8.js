// https://adventofcode.com/2021/day/4

const fs = require('fs')

let set = []
fs.readFile('./8.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n")
  const numbers = input[0].split(",").map(el => parseInt(el))

  const boards = []
  for(let i = 2; i < input.length; i += 6) {
    const board = []
    for(let j = 0; j < 5; j++) {
      board.push(input[i+j].split(" ").filter(el => el).map(el => parseInt(el)))
    }
    boards.push(board)
  }

  const winners = []
  while (numbers.length > 0) {
    const lastNum = numbers.shift()
    set.push(lastNum)
    let found = false
    boards.forEach((board, index) => {
      if (checkBoard(board) && winners.indexOf(index) < 0) {
        winners.push(index)
        if (winners.length === boards.length) {
          console.log(winners)
          console.log(`Winner #${index}`)
          console.log(board)
          let sum = 0
          board.forEach(row => {
            row.forEach(el => {
              if (set.indexOf(el) < 0) sum += el
            })
          })
          console.log(`last = ${lastNum}`)
          console.log(`sum = ${sum}`)
          console.log(`Answer = ${sum * lastNum}`)
          found = true
          return
        }
      }
    })
    if (found) break
  }
})

function checkBoard(board) {
  if (board.some(row => checkRow(row))) return true
  for (let i = 0; i < 5; i++) {
    const row = []
    for (let j = 0; j < 5; j++) {
      row.push(board[j][i])
    }
    if (checkRow(row)) return true
  }
}

function checkRow(row) {
  return row.every(el => set.indexOf(el) >= 0)
}
