import React, { Component } from "react";
import Node from "../node/node";
import styles from "./PathfindingVisualizer.module.css";
import nodeStyles from "../node/node.module.css";

import { dijkstra } from "../../algorithms/dijkstra";

let START_NODE_ROW = 4;
let START_NODE_COL = 3;
let END_NODE_ROW = 8;
let END_NODE_COL = 3;
const ROWS = 21;
const COLS = 45;

class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.prevNode = null;
    this.state = {
      grid: [],
      mousePressed: false,
      wherePressed: null,
      startNode: null,
      endNode: null
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({
      grid,
      startNode: grid[START_NODE_ROW][START_NODE_COL],
      endNode: grid[END_NODE_ROW][END_NODE_COL]
    });
  }

  cleanAll = () => {
    const { grid, startNode, endNode } = this.state;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] !== startNode && grid[row][col] !== endNode)
          grid[row][col].ref.current.className = nodeStyles.node;
        grid[row][col].isWall = false;
      }
    }
    this.setState({ grid });
  };

  visualizeDijkstra = () => {
    const { grid, startNode, endNode } = this.state;
    let { visitedNodesInOrder, sequence } = dijkstra(grid, startNode, endNode);

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          for (let j = 0; j < sequence.length; j++) {
            setTimeout(() => {
              const node = sequence[j];
              let className = grid[node.row][node.col].ref.current.className;
              className = className.concat(` ${nodeStyles.path}`);
              grid[node.row][node.col].ref.current.className = className;
            }, 100 * j);
          }
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        let className = grid[node.row][node.col].ref.current.className;
        className = className.concat(` ${nodeStyles.visited}`);
        grid[node.row][node.col].ref.current.className = className;
      }, 10 * i);
    }
  };

  onMouseDownEvent = node => {
    const { grid, startNode, endNode } = this.state;
    const { row, col, isStart, isEnd } = node.props;
    // this.prevNode = this;
    if (isStart) {
      grid[row][col].isStart = false;
      endNode.ref.current.className += ` ${nodeStyles.stopMouseEvent}`;
      this.setState({ mousePressed: true, wherePressed: "start" });
    } else if (isEnd) {
      grid[row][col].isEnd = false;
      startNode.ref.current.className += ` ${nodeStyles.stopMouseEvent}`;
      this.setState({ mousePressed: true, wherePressed: "end" });
    } else {
      endNode.ref.current.className += ` ${nodeStyles.stopMouseEvent}`;
      startNode.ref.current.className += ` ${nodeStyles.stopMouseEvent}`;
      this.toggleWall(node);
      this.setState({ mousePressed: true, wherePressed: "wall" });
    }
  };

  onMouseEnterEvent = node => {
    const { row, col } = node.props;
    const { grid, mousePressed, wherePressed } = this.state;

    let prevRow;
    let prevCol;
    if (this.prevNode) {
      prevCol = this.prevNode.props.col;
      prevRow = this.prevNode.props.row;
    }

    if (mousePressed) {
      let className = grid[row][col].ref.current.className;
      if (wherePressed === "start")
        className = className.concat(` ${nodeStyles.start}`);
      else if (wherePressed === "end")
        className = className.concat(` ${nodeStyles.end}`);
      if (wherePressed === "start" || wherePressed === "end")
        grid[prevRow][prevCol].ref.current.className = nodeStyles.node;
      // grid[row][col].ref.current.className = className;
      grid[row][col].ref.current.className = className;
      if (wherePressed === "wall") this.toggleWall(node);
    }
  };

  toggleWall = node => {
    const { row, col } = node.props;
    const { grid } = this.state;
    let className = grid[row][col].ref.current.className;
    if (!grid[row][col].isWall) {
      className = className.concat(` ${nodeStyles.wall}`);
      grid[row][col].isWall = true;
    } else {
      className = nodeStyles.node;
      grid[row][col].isWall = false;
    }
    grid[row][col].ref.current.className = className;
  };

  onMouseLeaveEvent = node => {
    this.prevNode = node;
  };

  onMouseUpEvent = node => {
    const { grid } = this.state;
    const { row, col } = node.props;
    if (this.state.wherePressed === "start") {
      grid[row][col].isStart = true;
      this.setState({ startNode: grid[row][col] });
      const { endNode } = this.state;
      // to remove stopMouseEvent on end node
      endNode.ref.current.className = nodeStyles.node + " " + nodeStyles.end;
    } else if (this.state.wherePressed === "end") {
      grid[row][col].isEnd = true;
      this.setState({ endNode: grid[row][col] });
      const { startNode } = this.state;
      startNode.ref.current.className =
        nodeStyles.node + " " + nodeStyles.start;
    } else if (this.state.wherePressed === "wall") {
      const { startNode, endNode } = this.state;
      endNode.ref.current.className = nodeStyles.node + " " + nodeStyles.end;
      startNode.ref.current.className =
        nodeStyles.node + " " + nodeStyles.start;
    }
    this.setState({ grid, mousePressed: false, wherePressed: null });
  };

  render() {
    const { grid } = this.state;
    return (
      <React.Fragment>
        <button onClick={this.visualizeDijkstra}>Start Algorithm</button>
        <button onClick={this.cleanAll}>Clean All</button>
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx} className={styles.row}>
              {row.map((node, nodeIdx) => {
                const {
                  row,
                  col,
                  isEnd,
                  isStart,
                  isVisited,
                  isPath,
                  isWall,
                  ref
                } = node;
                return (
                  <Node
                    ref={ref}
                    key={nodeIdx}
                    col={col}
                    row={row}
                    isEnd={isEnd}
                    isStart={isStart}
                    isVisited={isVisited}
                    isPath={isPath}
                    isWall={isWall}
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
        isWall: false,
        isVisited: false,
        isPath: false,
        ref: React.createRef()
      });
    }
    grid.push(currentRow);
  }
  return grid;
}

export default PathfindingVisualizer;
