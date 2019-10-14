import React, { Component } from "react";
import Node from "../node/node";
import styles from "./PathfindingVisualizer.module.css";
import nodeStyles from "../node/node.module.css";

import { dijkstra } from "../../algorithms/dijkstra";

let START_NODE_ROW = 5;
let START_NODE_COL = 3;
let END_NODE_ROW = 8;
let END_NODE_COL = 3;
const ROWS = 10;
const COLS = 20;
let prevNode = null;
let currNode = null;

class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mousePressed: false,
      wherePressed: null
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
    const endNode = grid[END_NODE_ROW][END_NODE_COL];
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

    //let grid1D = [].concat(...grid);
    for (let i = 0; i <= path.length; i++) {
      if (i === path.length) {
        setTimeout(() => {
          /*for (let j = 0; j < sequence.length; j++)
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
            }*/
          for (let j = 0; j < sequence.length; j++) {
            setTimeout(() => {
              const node = sequence[j];
              let className = this.myRef[node.row][node.col].current.className;
              className = className.concat(` ${nodeStyles.path}`);
              this.myRef[node.row][node.col].current.className = className;
            }, 100 * j);
          }
        }, 1 * i);
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
      }, 1 * i);
    }
  };

  onMouseDownEvent = node => {
    const { row, col, isStart, isEnd } = node.props;
    prevNode = this;
    if (isStart) {
      const { grid } = this.state;
      grid[row][col].isStart = false;
      this.myRef[END_NODE_ROW][
        END_NODE_COL
      ].current.className += ` ${nodeStyles.stopMouseEvent}`;
      this.setState({ mousePressed: true, wherePressed: "start" });
    } else if (isEnd) {
      const { grid } = this.state;
      grid[row][col].isEnd = false;
      this.myRef[START_NODE_ROW][
        START_NODE_COL
      ].current.className += ` ${nodeStyles.stopMouseEvent}`;
      this.setState({ mousePressed: true, wherePressed: "end" });
    }
  };

  onMouseEnterEvent = node => {
    const { row, col, isStart, isEnd } = node.props;
    let prevRow;
    let prevCol;
    if (prevNode) {
      prevCol = prevNode.props.col;
      prevRow = prevNode.props.row;
    }

    if (this.state.mousePressed) {
      let className = this.myRef[row][col].current.className;
      if (this.state.wherePressed === "start") {
        // const { grid } = this.state;
        // grid[row][col].isStart = true;
        // this.setState({ grid });

        // next node is not end
        // if (!isEnd) {

        className = className.concat(` ${nodeStyles.start}`);
        this.myRef[row][col].current.className = className;
        this.myRef[prevRow][prevCol].current.className = nodeStyles.node;
      } else if (this.state.wherePressed === "end") {
        className = className.concat(` ${nodeStyles.end}`);
        this.myRef[row][col].current.className = className;
        this.myRef[prevRow][prevCol].current.className = nodeStyles.node;
      }
    }
  };

  onMouseLeaveEvent = node => {
    prevNode = node;
    // console.log("prev node", prevNode);
    // if (this.state.mousePressed) {
    //   // const { grid } = this.state;
    //   // grid[row][col].isStart = false;
    //   //this.setState({ grid });
    //   const { row, col } = node.props;
    //   this.myRef[row][col].current.className = nodeStyles.node;
    // }
  };

  onMouseUpEvent = node => {
    const { grid } = this.state;
    const { row, col } = node.props;
    if (this.state.wherePressed === "start") {
      grid[row][col].isStart = true;
      START_NODE_ROW = row;
      START_NODE_COL = col;
      this.myRef[END_NODE_ROW][END_NODE_COL].current.className =
        nodeStyles.node + " " + nodeStyles.end;
    } else if (this.state.wherePressed === "end") {
      grid[row][col].isEnnd = true;
      END_NODE_ROW = row;
      END_NODE_COL = col;
      this.myRef[START_NODE_ROW][START_NODE_COL].current.className =
        nodeStyles.node + " " + nodeStyles.start;
    }
    this.setState({ grid, mousePressed: false, wherePressed: null });
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
                    onMouseEnter={this.onMouseEnterEvent}
                    onMouseLeave={this.onMouseLeaveEvent}
                    onMouseDown={this.onMouseDownEvent}
                    onMouseUp={this.onMouseUpEvent}
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
        isEnd: END_NODE_ROW === row && END_NODE_COL === col,
        isVisited: false,
        isPath: false
      });
    }
    grid.push(currentRow);
  }
  return grid;
}

export default PathfindingVisualizer;
