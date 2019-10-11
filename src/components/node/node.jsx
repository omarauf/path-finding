import React, { Component } from "react";
import styles from "./node.module.css";

class node extends Component {
  render() {
    const { row, col, isStart, isEnd, isVisited, isPath } = this.props;
    const extraClassName = isEnd
      ? styles.end
      : isStart
      ? styles.start
      : isVisited
      ? styles.visited
      : isPath
      ? styles.path
      : "";

    return (
      <div
        id={`node-${row}-${col}`}
        className={`${styles.node} ${extraClassName}`}
      ></div>
    );
  }
}

export default node;
