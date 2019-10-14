export function dijkstra(grid, startNode, finishNode) {
  const unvisitedNodes = [];
  const visitedNodesInOrder = [];
  getAllNodes(grid, unvisitedNodes); // copy all node in grid to grid
  setDist(unvisitedNodes); // set dist to unvisited node to 1 (inf)
  startNode.dist = 0;
  setPrev(unvisitedNodes); // set prev's node to undefine

  while (!!unvisitedNodes.length) {
    let u = minDistNodeIn(unvisitedNodes);
    if (u === undefined) break;

    visitedNodesInOrder.push(u);
    removeNodeFrom(u, unvisitedNodes);

    // for each neighbor of u
    let neighbors = getAdjacentNode(u, unvisitedNodes);
    for (let i = 0; i < neighbors.length; i++) {
      neighbors[i].dist = u.dist + 1;
      neighbors[i].prev = u;
    }
    if (u === finishNode) break;
  }

  let sequence = [];
  let u = finishNode;
  if (u.prev != null || u === startNode) {
    while (u != null) {
      sequence.push(u);
      u = u.prev;
    }
  }

  sequence.reverse();
  sequence.shift(); //remove first start node
  sequence.pop(); //remove last end node
  visitedNodesInOrder.shift(); //remove first start node
  console.log(sequence.length);
  if (sequence.length > 0) visitedNodesInOrder.pop(); //remove last end node
  return { visitedNodesInOrder, sequence };
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
  for (let row = 0; row < unvisitedNodes.length; row++)
    for (let col = 0; col < unvisitedNodes[row].length; col++) {
      if (
        (unvisitedNodes[row][col].row === rowSource &&
          unvisitedNodes[row][col].col === colSource - 1 &&
          !unvisitedNodes[row][col].isWall) ||
        (unvisitedNodes[row][col].row === rowSource + 1 &&
          unvisitedNodes[row][col].col === colSource &&
          !unvisitedNodes[row][col].isWall) ||
        (unvisitedNodes[row][col].row === rowSource &&
          unvisitedNodes[row][col].col === colSource + 1 &&
          !unvisitedNodes[row][col].isWall) ||
        (unvisitedNodes[row][col].row === rowSource - 1 &&
          unvisitedNodes[row][col].col === colSource &&
          !unvisitedNodes[row][col].isWall)
      ) {
        neighbor.push(unvisitedNodes[row][col]);
      }
    }
  return neighbor;
}

function removeNodeFrom(node, unvisitedNodes) {
  for (let row = 0; row < unvisitedNodes.length; row++)
    for (let col = 0; col < unvisitedNodes[row].length; col++) {
      if (unvisitedNodes[row][col] === node) {
        unvisitedNodes[row].splice(col, 1);
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
