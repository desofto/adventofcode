const heights = require("./17-2-2.json");

// 1541449275365 < 1546495452183

let found = false;
for (let skip = 0; !found && skip < heights.length / 2; skip++) {
  for (let cycle = 10; !found && cycle < heights.length / 8; cycle++) {
    found = true;
    const height = heights[skip + cycle - 1] - heights[skip];
    // for (let i = skip; found && i < heights.length; i += cycle) {
    //   if (heights[i + cycle - 1] - heights[i] !== height) {
    //     found = false;
    //   }
    // }

    for (let i = skip; found && i < heights.length; i += cycle) {
      const calcHeight = (heights[skip]) + (height + 1) * Math.floor((i - skip) / cycle);// + (heights[skip + rest] - heights[skip]);
      if (calcHeight !== heights[i]) {
        // throw new Error(`${skip}, ${cycle}`);
        found = false;
      }
    }

    if (found) {
      console.log(skip, heights[skip], cycle, height);
      const rest = (1000000000000 - skip) % cycle;
      const totalHeigh = (heights[skip]) + (height + 1) * Math.floor((1000000000000 - skip) / cycle) + (heights[skip + rest] - heights[skip]);
      console.log(rest, totalHeigh, 1514285714288 - totalHeigh);
      // if (1514285714288 !== totalHeigh) throw new Error();
    }
    if (skip < 100) found = false;
  }
}
