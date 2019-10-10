export function dijkstra(grid, startNode, finishNode) {
  const unvisitedNodes = getAllNodes(grid); // copy all node in grid
  const visitedNodesInOrder = [];
  setDist(unvisitedNodes); // set dist to unvisited node to 1 (inf)
  startNode.dist = 0;
  setPrev(unvisitedNodes); // set prev's node to undefine
  console.log(unvisitedNodes);

  while (!!unvisitedNodes.length) {
    let u = minDistNode(unvisitedNodes);
    // unvisitedNodes.removeNode(u);
    console.log(unvisitedNodes);
    unvisitedNodes.pop(0);
  }
}

function minDistNode(grid) {
  let u;
  let dist = 1;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].dist < dist) u = grid[row][col];
    }
  }
  return u;
}

function setDist(grid) {
  grid.forEach(row => {
    row.forEach(node => {
      node.dist = 1;
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

function getAllNodes(grid) {
  const newGrid = [];
  for (let row = 0; row < grid.length; row++) {
    const newRow = [];
    for (let col = 0; col < grid[row].length; col++) {
      newRow.push(grid[row][col]);
    }
    newGrid.push(newRow);
  }
  return newGrid;
}
