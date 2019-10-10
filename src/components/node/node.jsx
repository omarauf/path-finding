import React, { Component } from "react";
import styles from "./node.module.css";

class node extends Component {
  render() {
    const { row, col, isStart, isEnd } = this.props;
    const extraClassName = isEnd ? styles.end : isStart ? styles.start : "";

    return (
      <div
        id={`node-${row}-${col}`}
        className={`${styles.node} ${extraClassName}`}
      ></div>
    );
  }
}

export default node;
