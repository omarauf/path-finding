import React, { Component } from "react";
import Node from "../node/node";
import styles from "./PathfindingVisualizer.module.css";
import nodeStyles from "../node/node.module.css";

import { dijkstra } from "../../algorithms/dijkstra";

let START_NODE_ROW = 8;
let START_NODE_COL = 19;
let END_NODE_ROW = 8;
let END_NODE_COL = 15;
const ROWS = 28;
const COLS = 75;

class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.prevNode = null;
    this.wherePressed = null;
    this.mousePressed = false;

    this.mapRef = React.createRef();
    this.state = {
      grid: [],
      startNode: null,
      endNode: null,
      isWorking: false
    };
  }

  componentDidMount() {
    // console.log("[Component Did Mount]");
    const grid = getInitialGrid();
    this.setState({
      grid,
      startNode: grid[START_NODE_ROW][START_NODE_COL],
      endNode: grid[END_NODE_ROW][END_NODE_COL]
    });
  }

  /**
   * Loop in all nodes and assign it's class to all node except start and end node and remove all wall
   */
  clearAll = () => {
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

  /**
   * solve the puzzkle
   * Render the visited node and path if exist
   */
  visualizeDijkstra = () => {
    this.setState({ isWorking: true });
    const { grid, startNode, endNode } = this.state;
    let { visitedNodesInOrder, sequence } = dijkstra(grid, startNode, endNode);
    // add stop class to map
    this.mapRef.current.className = styles.stopMouseEvent;
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        for (let j = 0; j <= sequence.length; j++) {
          if (j === sequence.length) {
            setTimeout(() => {
              // remove stop class from map
              this.mapRef.current.className = "";
              this.setState({ isWorking: false });
            }, 10 * i + 100 * j);
            return;
          }
          // second render the path node every 10 ms after the first render finsih (10 * i)
          setTimeout(() => {
            const node = sequence[j];
            grid[node.row][node.col].ref.current.className = `${nodeStyles.node} ${nodeStyles.path}`;
          }, 10 * i + 100 * j);
        }
        return;
      }
      // first render the visited node every 10 ms
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        grid[node.row][node.col].ref.current.className = `${nodeStyles.node} ${nodeStyles.visited}`;
      }, 10 * i);
    }
  };

  onMouseDownEvent = node => {
    const { grid, startNode, endNode } = this.state;
    const { row, col, isStart, isEnd } = node.props;
    if (isStart) {
      grid[row][col].isStart = false;
      endNode.ref.current.className += ` ${nodeStyles.stopMouseEvent}`;
      this.wherePressed = "start";
    } else if (isEnd) {
      grid[row][col].isEnd = false;
      startNode.ref.current.className += ` ${nodeStyles.stopMouseEvent}`;
      this.wherePressed = "end";
    } else {
      this.toggleWall(node);
      this.wherePressed = "wall";
    }
    this.mousePressed = true;
  };

  onMouseEnterEvent = node => {
    const { row, col } = node.props;
    const { grid } = this.state;
    let prevRow;
    let prevCol;
    if (this.prevNode) {
      prevCol = this.prevNode.props.col;
      prevRow = this.prevNode.props.row;
    }
    if (this.mousePressed) {
      let className = grid[row][col].ref.current.className;

      // move start to new entered node
      if (this.wherePressed === "start") {
        if (node.props.isWall) {
          // the enter node is wall then remove the wall propertie
          grid[row][col].isWall = false;
        }
        className = className.concat(` ${nodeStyles.start}`);
      }
      // move end to new entered node
      else if (this.wherePressed === "end") {
        if (node.props.isWall) {
          // the enter node is wall then remove the wall propertie
          grid[row][col].isWall = false;
        }
        className = className.concat(` ${nodeStyles.end}`);
      }
      // convert previous node to normal node
      if (this.wherePressed === "start" || this.wherePressed === "end")
        grid[prevRow][prevCol].ref.current.className = nodeStyles.node;
      grid[row][col].ref.current.className = className;
      if (this.wherePressed === "wall") {
        this.toggleWall(node);
      }
    }
  };

  onMouseLeaveEvent = node => {
    this.prevNode = node;
  };

  onMouseUpEvent = node => {
    const { grid } = this.state;
    const { row, col } = node.props;
    if (this.wherePressed === "start") {
      grid[row][col].isStart = true;
      this.setState({ startNode: grid[row][col] });
      const { endNode } = this.state;
      // to remove stopMouseEvent on end node
      endNode.ref.current.className = nodeStyles.node + " " + nodeStyles.end;
    } else if (this.wherePressed === "end") {
      grid[row][col].isEnd = true;
      this.setState({ endNode: grid[row][col] });
      const { startNode } = this.state;
      startNode.ref.current.className = nodeStyles.node + " " + nodeStyles.start;
    } else if (this.wherePressed === "wall") {
      const { startNode, endNode } = this.state;
      endNode.ref.current.className = nodeStyles.node + " " + nodeStyles.end;
      startNode.ref.current.className = nodeStyles.node + " " + nodeStyles.start;
    }
    this.mousePressed = false;
    this.wherePressed = null;
    this.setState({ grid });
  };

  toggleWall = node => {
    const { row, col, isStart, isEnd } = node.props;
    const { grid } = this.state;
    let className = grid[row][col].ref.current.className;
    if (isStart || isEnd) return;
    // add wall if not else remove the wall
    if (!grid[row][col].isWall) {
      className = className.concat(` ${nodeStyles.wall}`);
      grid[row][col].isWall = true;
    } else {
      className = nodeStyles.node;
      grid[row][col].isWall = false;
    }
    grid[row][col].ref.current.className = className;
  };

  renderGrid = () => {
    return this.state.grid.map((row, rowIdx) => {
      return (
        <tr key={rowIdx} className={styles.row}>
          {row.map((node, nodeIdx) => {
            return (
              <Node
                key={nodeIdx}
                ref={node.ref}
                col={node.col}
                row={node.row}
                isEnd={node.isEnd}
                isStart={node.isStart}
                isVisited={node.isVisited}
                isPath={node.isPath}
                isWall={node.isWall}
                onMouseEnter={this.onMouseEnterEvent}
                onMouseLeave={this.onMouseLeaveEvent}
                onMouseDown={this.onMouseDownEvent}
                onMouseUp={this.onMouseUpEvent}
              />
            );
          })}
        </tr>
      );
    });
  };

  renderCancelButton = () => {
    if (!this.state.isWorking)
      return (
        <button className="btn btn-danger" onClick={this.clearAll}>
          Clean All
        </button>
      );
    return (
      <button disabled className="btn btn-danger" onClick={this.clearAll}>
        Clean All
      </button>
    );
  };

  render() {
    // console.log("[Render]");
    return (
      <React.Fragment>
        <div className={styles.container}>
          <button className="btn btn-primary" onClick={this.visualizeDijkstra}>
            Start Algorithm
          </button>
          {this.renderCancelButton()}
        </div>
        <table ref={this.mapRef}>
          <tbody>{this.renderGrid()}</tbody>
        </table>
      </React.Fragment>
    );
  }
}

/**
 * Initialize the grid with node properties and where it start and end
 */
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
