import React, { Component } from "react";
import styles from "./node.module.css";

class Node extends Component {
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
        ref={this.props.innerRef}
        id={`node-${row}-${col}`}
        className={`${styles.node} ${extraClassName}`}
      ></div>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <Node innerRef={ref} {...props} />
));
