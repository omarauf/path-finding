import React, { Component } from "react";
import Node from "../node/node";
import styles from "./PathfindingVisualizer.module.css";
import { dijkstra } from "../../algorithms/dijkstra";

const START_NODE_ROW = 2;
const START_NODE_COL = 3;
const FINISH_NODE_ROW = 8;
const FINISH_NODE_COL = 16;

class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: []
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  visualizeDijkstra = async () => {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    let { path, sequence } = dijkstra(grid, startNode, endNode);
    console.log(sequence);
    let grid1D = [].concat(...grid);
    for (let i = 0; i < path.length; i++) {
      for (let y = 0; y < grid1D.length; y++) {
        setInterval(() => {
          if (grid1D[y].col === path[i].col && grid1D[y].row === path[i].row) {
            grid[grid1D[y].row][grid1D[y].col].isVisited = true;
            this.setState({ grid });
          }
        }, 25);
      }
    }
    setTimeout(null, 1000);
    for (let i = 0; i < sequence.length; i++) {
      for (let y = 0; y < grid1D.length; y++) {
        // setInterval(() => {
        if (
          grid1D[y].col === sequence[i].col &&
          grid1D[y].row === sequence[i].row
        ) {
          grid[grid1D[y].row][grid1D[y].col].isPath = true;
          this.setState({ grid });
          console.log("yes");
        }
        // }, 25);
      }
    }
  };

  render() {
    const { grid } = this.state;
    return (
      <React.Fragment>
        <button onClick={this.visualizeDijkstra}>Start Algorithm</button>
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx} className={styles.row}>
              {row.map((node, nodeIdx) => {
                const { row, col, isEnd, isStart, isVisited, isPath } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    row={row}
                    isEnd={isEnd}
                    isStart={isStart}
                    isVisited={isVisited}
                    isPath={isPath}
                  />
                );
              })}
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}

function getInitialGrid() {
  const grid = [];
  for (let row = 0; row < 10; row++) {
    const currentRow = [];
    for (let col = 0; col < 20; col++) {
      currentRow.push({
        row,
        col,
        isStart: START_NODE_ROW === row && START_NODE_COL === col,
        isEnd: FINISH_NODE_ROW === row && FINISH_NODE_COL === col,
        isVisited: false,
        isPath: false
      });
    }
    grid.push(currentRow);
  }
  return grid;
}

export default PathfindingVisualizer;
