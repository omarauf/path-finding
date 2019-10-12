const grid = [];
export function dijkstra(g, startNode, finishNode) {
  const unvisitedNodes = [];
  let path = [];
  getAllNodes(g, grid); // copy all node in grid to grid
  //   const visitedNodesInOrder = [];
  setDist(grid); // set dist to unvisited node to 1 (inf)
  startNode.dist = 0;
  setPrev(grid); // set prev's node to undefine
  getAllNodes(g, unvisitedNodes); // copy all node in grid to unvisitedNodes

  while (!!unvisitedNodes.length) {
    let u = minDistNodeIn(unvisitedNodes);
    path.push(u);
    removeNodeFrom(u, unvisitedNodes);

    // for each neighbor of u
    let neighbors = getAdjacentNode(u, unvisitedNodes);
    for (let i = 0; i < neighbors.length; i++) {
      neighbors[i].dist = u.dist + 1;
      neighbors[i].prev = u;
    }
    if (u === finishNode) break;

    // neighbors.forEach(v => {
    //   v.dist = u.dist + 1; // if cost is not equal then use length function
    //   //   v.prev = u;
    // });

    //unvisitedNodes.pop();
  }
  let sequence = [];
  let u = finishNode;
  if (u.prev != null || u === startNode) {
    while (u != null) {
      sequence.push(u);
      u = u.prev;
    }
  }
  // console.log("grid", grid);
  // console.log("sequence", sequence);
  // console.log("path", path);
  sequence.reverse();
  sequence.shift(); //remove first start node
  sequence.pop(); //remove last end node
  path.shift(); //remove first start node
  path.pop(); //remove last end node
  return { path, sequence };
}

// function length(u, v) {
//   let { rowSource, colSource } = u;
//   let { rowTarget, colTarget } = v;
//   return Math.abs(rowTarget - rowSource + (colTarget - colSource));
// }

function getAdjacentNode(u, unvisitedNodes) {
  const neighbor = [];
  const colSource = u.col;
  const rowSource = u.row;
  //   if (row !== 9) neighbor.push(grid[row + 1][col]);
  //   if (col !== 19) neighbor.push(grid[row][col + 1]);
  //   if (row !== 0) neighbor.push(grid[row - 1][col]);
  //   if (col !== 0) neighbor.push(grid[row][col - 1]);
  //   if (row !== 9) neighbor.push(grid[row + 1].slice(col, col + 1));
  //   if (col !== 19) neighbor.push(grid[row].slice(col + 1, col + 2));
  //   if (row !== 0) neighbor.push(grid[row - 1].slice(col, col + 1));
  //   if (col !== 0) neighbor.push(grid[row].slice(col - 1, col));
  for (let row = 0; row < unvisitedNodes.length; row++)
    for (let col = 0; col < unvisitedNodes[row].length; col++) {
      if (
        (unvisitedNodes[row][col].row === rowSource + 1 &&
          unvisitedNodes[row][col].col === colSource) ||
        (unvisitedNodes[row][col].row === rowSource &&
          unvisitedNodes[row][col].col === colSource + 1) ||
        (unvisitedNodes[row][col].row === rowSource - 1 &&
          unvisitedNodes[row][col].col === colSource) ||
        (unvisitedNodes[row][col].row === rowSource &&
          unvisitedNodes[row][col].col === colSource - 1)
      ) {
        neighbor.push(unvisitedNodes[row][col]);
      }
    }

  return neighbor;
}

function removeNodeFrom(node, unvisitedNodes) {
  //   const { row, col } = node;
  //   grid[row].splice(col, 1);
  for (let row = 0; row < unvisitedNodes.length; row++)
    for (let col = 0; col < unvisitedNodes[row].length; col++) {
      if (unvisitedNodes[row][col] === node) {
        unvisitedNodes[row].splice(col, 1);
        // console.log(node);
      }
    }
}

function minDistNodeIn(grid) {
  let u;
  let dist = Infinity;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].dist < dist) {
        dist = grid[row][col].dist;
        u = grid[row][col];
      }
    }
  }
  return u;
}

function setDist(grid) {
  grid.forEach(row => {
    row.forEach(node => {
      node.dist = Infinity;
    });
  });
}

function setPrev(grid) {
  grid.forEach(row => {
    row.forEach(node => {
      node.prev = undefined;
    });
  });
}

function getAllNodes(grid, target) {
  for (let row = 0; row < grid.length; row++) {
    const newRow = [];
    for (let col = 0; col < grid[row].length; col++) {
      newRow.push(grid[row][col]);
    }
    target.push(newRow);
  }
}
