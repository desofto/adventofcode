// https://adventofcode.com/2021/day/19

const scanners = [
  [ 0, 0, 0 ],             [ 29, 1057, 105 ],
  [ -1140, -135, 1377 ],   [ 53, -117, -3543 ],
  [ 1191, 2329, 1375 ],    [ 86, -127, -1153 ],
  [ -1085, 1120, 47 ],     [ 45, 2280, -1019 ],
  [ 1216, 1120, 2416 ],    [ 1160, 2231, -1123 ],
  [ -31, -2493, -2288 ],   [ -2447, -99, 1322 ],
  [ 129, -2430, -1044 ],   [ -2325, -2564, 142 ],
  [ -1080, -2479, 57 ],    [ 88, -81, 1292 ],
  [ 118, 2270, 157 ],      [ -3, -3739, -1197 ],
  [ -1117, 2390, 133 ],    [ 14, -113, -2259 ],
  [ -1150, -2511, -2339 ], [ 1325, 1205, 103 ],
  [ 18, -1198, 75 ],       [ 111, -2492, 12 ],
  [ 127, -2412, -3436 ],   [ -1152, -1337, 1293 ],
  [ 109, -2416, 1228 ],    [ 78, 1134, 1190 ],
  [ -2303, -3720, 146 ],   [ 2409, 2252, 1199 ],
  [ 18, -4915, -1074 ],    [ 1191, 6, 1319 ],
  [ 1149, 1171, 1360 ]
]

//console.log(distance([1105,-1205,1229], [-92,-2380,-20]))

let max = 0
for (let i1 = 0; i1 < scanners.length; i1++) {
  for (let i2 = 0; i2 < scanners.length; i2++) {
    const d = distance(scanners[i1], scanners[i2])
    max = Math.max(max, d)
  }
}
console.log(max)

function distance([x1, y1, z1], [x2, y2, z2]) {
  return Math.abs(x2-x1) + Math.abs(y2-y1) + Math.abs(z2-z1)
}
