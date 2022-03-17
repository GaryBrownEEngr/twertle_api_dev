// https://reactjs.org/tutorial/tutorial.html

import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

function Square(props) {
  return (
    <button
      style={{
        backgroundColor: props.isWinningCell ? "Green" : "inherit",
      }}
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, isWinningCell) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        isWinningCell={isWinningCell}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const out = [];
    for (let row = 0; row < 3; row++) {
      let inner = [];

      for (let col = 0; col < 3; col++) {
        let cell = col + 3 * row;
        inner.push(
          this.renderSquare(cell, -1 !== this.props.partsOfWin.indexOf(cell))
        );
      }
      out.push(
        <div key={row} className="board-row">
          {inner}
        </div>
      );
    }

    return <div>{out}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          selectedCellNumber: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      sortReversed: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([
        {
          squares: squares,
          selectedCellNumber: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const partsOfWin = returnWinLine(current.squares);
    const isDraw = !winner && this.state.stepNumber === 9;

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" +
          move +
          " r/c=" +
          (Math.floor(step.selectedCellNumber / 3) + 1) +
          "/" +
          ((step.selectedCellNumber % 3) + 1)
        : "Go to game start";
      return (
        <li key={move}>
          <button
            style={{
              fontWeight: move === this.state.stepNumber ? "bold" : "normal",
            }}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });
    if (this.state.sortReversed) {
      moves.reverse();
    }

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (isDraw) {
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            partsOfWin={partsOfWin}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <label>
              reverse sort
              <input
                type="checkbox"
                checked={this.state.sortReversed}
                onChange={() =>
                  this.setState({ sortReversed: !this.state.sortReversed })
                }
              ></input>
            </label>
          </div>

          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function returnWinLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return [];
}

// ========================================
ReactDOM.render(<Game />, document.getElementById("root"));
