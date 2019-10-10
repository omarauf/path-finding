import React, { Component } from "react";
import Node from "../node/node";
import styles from "./PathfindingVisualizer.module.css";
import { dijkstra } from "../../algorithms/dijkstra";

const START_NODE_ROW = 1;
const START_NODE_COL = 1;
const FINISH_NODE_ROW = 8;
const FINISH_NODE_COL = 16;

class PathfindingVisualizer extends Component {
  state = {
    grid: [],
    start: null,
    end: null
  };

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  visualizeDijkstra = () => {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    // console.log(grid);
    dijkstra(grid, startNode, endNode);
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
                const { row, col, isEnd, isStart } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    row={row}
                    isEnd={isEnd}
                    isStart={isStart}
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
        isEnd: FINISH_NODE_ROW === row && FINISH_NODE_COL === col
      });
    }
    grid.push(currentRow);
  }
  return grid;
}

export default PathfindingVisualizer;
