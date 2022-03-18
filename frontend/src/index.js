// https://reactjs.org/tutorial/tutorial.html

import React, { useState } from "react";
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

function Board(props) {
  const out = [];
  for (let row = 0; row < 3; row++) {
    let inner = [];

    for (let col = 0; col < 3; col++) {
      let cell = col + 3 * row;
      inner.push(
        <Square
          key={cell}
          value={props.squares[cell]}
          isWinningCell={-1 !== props.partsOfWin.indexOf(cell)}
          onClick={() => props.onClick(cell)}
        />
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

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

function Game() {
  const [GameState, setGameState] = useState({
    history: [
      {
        squares: Array(9).fill(null),
        selectedCellNumber: null,
      },
    ],
    stepNumber: 0,
    xIsNext: true,
    sortReversed: false,
  });

  function handleClick(i) {
    const history = GameState.history.slice(0, GameState.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = GameState.xIsNext ? "X" : "O";

    setGameState({
      history: history.concat([
        {
          squares: squares,
          selectedCellNumber: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !GameState.xIsNext,
      sortReversed: GameState.sortReversed,
    });
  }

  function jumpTo(step) {
    setGameState({ ...GameState, stepNumber: step, xIsNext: step % 2 === 0 });
  }

  const history = GameState.history;
  const current = history[GameState.stepNumber];
  const winner = calculateWinner(current.squares);
  const partsOfWin = returnWinLine(current.squares);
  const isDraw = !winner && GameState.stepNumber === 9;

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
            fontWeight: move === GameState.stepNumber ? "bold" : "normal",
          }}
          onClick={() => jumpTo(move, GameState, setGameState)}
        >
          {desc}
        </button>
      </li>
    );
  });
  if (GameState.sortReversed) {
    moves.reverse();
  }

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw) {
    status = "Draw";
  } else {
    status = "Next player: " + (GameState.xIsNext ? "X" : "O");
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          partsOfWin={partsOfWin}
          onClick={(i) => handleClick(i, GameState, setGameState)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div>
          <label>
            reverse sort
            <input
              type="checkbox"
              checked={GameState.sortReversed}
              onChange={() =>
                setGameState({
                  ...GameState,
                  sortReversed: !GameState.sortReversed,
                })
              }
            ></input>
          </label>
        </div>

        <ol>{moves}</ol>
      </div>
      <Example></Example>
    </div>
  );
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
