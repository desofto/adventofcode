// https://adventofcode.com/2021/day/8

const fs = require('fs')

const Translations = [
  { a: 1, bd: 1, cf: 2, eg: 2 },
  { a: 0, bd: 0, cf: 2, eg: 0 },
  { a: 1, bd: 1, cf: 1, eg: 2 },
  { a: 1, bd: 1, cf: 2, eg: 1 },
  { a: 0, bd: 2, cf: 2, eg: 0 },
  { a: 1, bd: 2, cf: 1, eg: 1 },
  { a: 1, bd: 2, cf: 1, eg: 2 },
  { a: 1, bd: 0, cf: 2, eg: 0 },
  { a: 1, bd: 2, cf: 2, eg: 2 },
  { a: 1, bd: 2, cf: 2, eg: 1 }
]

/*
const digits = [
  [1, 1, 1, 0, 1, 1, 1], 6 0
  [0, 0, 1, 0, 0, 1, 0], 2 1 -
  [1, 0, 1, 1, 1, 0, 1], 5 2
  [1, 0, 1, 1, 0, 1, 1], 5 3
  [0, 1, 1, 1, 0, 1, 0], 4 4 -
  [1, 1, 0, 1, 0, 1, 1], 5 5
  [1, 1, 0, 1, 1, 1, 1], 6 6
  [1, 0, 1, 0, 0, 1, 0], 3 7 -
  [1, 1, 1, 1, 1, 1, 1], 7 8 -
  [1, 1, 1, 1, 0, 1, 1]  6 9
]
*/

const Train = {
  4: ['b', 'c', 'd', 'f'],
  3: ['a', 'c', 'f'],
  2: ['c', 'f']
}

fs.readFile('./15.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const input = data.split("\n")

  let sum = 0

  input.forEach(line => {
    if (line.length < 1) return true

    const [train, test] = line.split("|").map(el => el.trim())

    const map = {
      "a": ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      "b": ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      "c": ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      "d": ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      "e": ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      "f": ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      "g": ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    }
    train.split(' ').sort((a, b) => b.length - a.length).forEach(el => {
      const tr = Train[el.length]
      if (tr) {
        Object.keys(map).forEach(key => {
          if (tr.indexOf(key) >= 0) {
            map[key] = map[key].filter(e => el.split("").indexOf(e) >= 0)
          } else {
            el.split("").forEach(ch => {
              map[key] = map[key].filter(e => e !== ch)
            })
          }
        })
      }
    })

    /*
    Object.keys(map).forEach(key => {
      if (['e', 'g'].indexOf(key) < 0) {
        map['e'].forEach(ch => {
          map[key] = map[key].filter(e => e !== ch)
        })
        map['g'].forEach(ch => {
          map[key] = map[key].filter(e => e !== ch)
        })
      }
    })

    Object.keys(map).forEach(key => {
      if (['b', 'd'].indexOf(key) < 0) {
        map['b'].forEach(ch => {
          map[key] = map[key].filter(e => e !== ch)
        })
        map['d'].forEach(ch => {
          map[key] = map[key].filter(e => e !== ch)
        })
      }
    })

    Object.keys(map).forEach(key => {
      if (['a'].indexOf(key) < 0) {
        map['a'].forEach(ch => {
          map[key] = map[key].filter(e => e !== ch)
        })
      }
    })
    */

    const number = test.split(" ").map(t => {
      t = t.split("")

      const res = {
        a: 0,
        eg: 0,
        bd: 0,
        cf: 0
      }

      t.forEach(e => {
        Object.keys(map).forEach(key => {
          if (map[key].indexOf(e) >= 0) {
            if (key === 'a') res['a']++
            else if (key === 'e') res['eg']++
            else if (key === 'b') res['bd']++
            else if (key === 'c') res['cf']++
          }
        })
      })

      let digit
      Translations.forEach((obj, index) => {
        if (obj['a'] === res['a'] && obj['eg'] === res['eg'] && obj['bd'] === res['bd'] && obj['cf'] === res['cf']) {
          digit = index
        }
      })

      console.log(digit)

      return digit
    }).join("")

    console.log(number)

    sum += parseInt(number)
  })

  console.log(sum)
})
