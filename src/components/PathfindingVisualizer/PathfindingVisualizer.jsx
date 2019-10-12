import React, { Component } from "react";
import Node from "../node/node";
import styles from "./PathfindingVisualizer.module.css";
import nodeStyles from "../node/node.module.css";

import { dijkstra } from "../../algorithms/dijkstra";

const START_NODE_ROW = 2;
const START_NODE_COL = 3;
const FINISH_NODE_ROW = 19;
const FINISH_NODE_COL = 39;
const ROWS = 20;
const COLS = 40;

class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: []
    };
    this.myRef = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push(React.createRef());
      }
      this.myRef.push(currentRow);
    }
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
    // console.log(this.myRef);
  }

  visualizeDijkstra = async () => {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    let { path, sequence } = dijkstra(grid, startNode, endNode);
    // console.log(sequence);
    // let grid1D = [].concat(...grid);
    // for (let i = 0; i <= path.length; i++) {
    //   if (i === path.length) {
    //     setTimeout(() => {
    //       for (let j = 0; j < sequence.length; j++)
    //         for (let y = 0; y < grid1D.length; y++) {
    //           setTimeout(() => {
    //             if (
    //               grid1D[y].col === sequence[j].col &&
    //               grid1D[y].row === sequence[j].row
    //             ) {
    //               grid[grid1D[y].row][grid1D[y].col].isPath = true;
    //               grid[grid1D[y].row][grid1D[y].col].isVisited = false;
    //               this.setState({ grid });
    //               console.log(grid);
    //             }
    //           }, 100 * j);
    //         }
    //     }, 10 * i + 10);
    //     return;
    //   }
    //   setTimeout(() => {
    //     const node = path[i];
    //     grid[node.row][node.col].isVisited = true;
    //     this.setState({ grid });
    //   }, 10 * i);
    // }

    let grid1D = [].concat(...grid);
    for (let i = 0; i <= path.length; i++) {
      if (i === path.length) {
        setTimeout(() => {
          for (let j = 0; j < sequence.length; j++)
            for (let y = 0; y < grid1D.length; y++) {
              setTimeout(() => {
                if (
                  grid1D[y].col === sequence[j].col &&
                  grid1D[y].row === sequence[j].row
                ) {
                  // grid[grid1D[y].row][grid1D[y].col].isPath = true;
                  // grid[grid1D[y].row][grid1D[y].col].isVisited = false;
                  // this.setState({ grid });

                  let className = this.myRef[grid1D[y].row][grid1D[y].col]
                    .current.className;
                  className = className.concat(` ${nodeStyles.path}`);

                  this.myRef[grid1D[y].row][
                    grid1D[y].col
                  ].current.className = className;
                }
              }, 100 * j);
            }
        }, 10 * i + 10);
        return;
      }
      setTimeout(() => {
        const node = path[i];
        // grid[node.row][node.col].isVisited = true;
        // this.setState({ grid });
        // this.myRef[node.row][
        //   node.col
        // ].current.className = `${nodeStyles.visited} ${className}`;
        let className = this.myRef[node.row][node.col].current.className;
        className = className.concat(` ${nodeStyles.visited}`);
        this.myRef[node.row][node.col].current.className = className;
      }, 10 * i);
    }
  };

  render() {
    const { grid } = this.state;
    // let counter = 0;
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
                    ref={this.myRef[row][col]}
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
  for (let row = 0; row < ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < COLS; col++) {
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
