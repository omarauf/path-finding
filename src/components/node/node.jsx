import React, { Component } from "react";
import styles from "./node.module.css";

class node extends Component {
  render() {
    const { row, col } = this.props;
    return <div id={`node-${row}-${col}`} className={styles.node}></div>;
  }
}

export default node;
