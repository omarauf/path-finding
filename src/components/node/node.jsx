import React, { Component } from "react";
import styles from "./node.module.css";

class Node extends Component {
  render() {
    const { row, col, isStart, isEnd, isVisited, isPath, isWall } = this.props;
    const extraClassName = isEnd
      ? styles.end
      : isStart
      ? styles.start
      : isVisited
      ? styles.visited
      : isPath
      ? styles.path
      : isWall
      ? styles.wall
      : "";

    return (
      <td
        ref={this.props.innerRef}
        id={`node-${row}-${col}`}
        className={`${styles.node} ${extraClassName}`}
        onMouseEnter={() => {
          this.props.onMouseEnter(this);
        }}
        onMouseLeave={() => {
          this.props.onMouseLeave(this);
        }}
        onMouseDown={() => {
          this.props.onMouseDown(this);
        }}
        onMouseUp={() => {
          this.props.onMouseUp(this);
        }}
      ></td>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <Node innerRef={ref} {...props} />
));
