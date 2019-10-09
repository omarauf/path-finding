import React from "react";
import Node from "./node/node";

const START_NODE_ROW = 1;
const START_NODE_COL = 1;
const FINISH_NODE_ROW = 3;
const FINISH_NODE_COL = 3;

class App extends React.Component {
  state = {
    grid: []
  };

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  render() {
    const { grid } = this.state;

    console.log(grid);
    return (
      <React.Fragment>
        <button onClick={() => console.log("START")}>Start Algorithm</button>
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx} className="ss">
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
  for (let row = 0; row < 5; row++) {
    const currentRow = [];
    for (let col = 0; col < 10; col++) {
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

export default App;
