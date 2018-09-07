import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      onClick={props.onClick}
      className={"square " + (props.winning ? "winning-square" : null)}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i.toString()}
        value={this.props.squares[i]}
        winning={this.props.winningSquares.includes(i) ? true : false}
        onClick={ () => this.props.onClick(i) }
      />
    );
  }

  render() {
    let i = 0;
    let board = [];
    for (let j = 0; j < 3; j++) {
      let row = [];
      for (let k = 0; k < 3; k++) {
        row.push(this.renderSquare(i));
        i++;
      }
      board.push(<div key={"row-" + j.toString()} className="board-row">{row}</div>);
    }
    return <div>{board}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      sortNatural: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();

    if (calculateWinningSquares(squares) || squares[i]) {
      return;
    } else {
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }
  }

  jumpTo(step) {
    console.log('this: ', this);
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleOrder() {
    const sortNatural = !this.state.sortNatural;
    this.setState({
      sortNatural: sortNatural,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winningSquares = calculateWinningSquares(current.squares);

    let winner;
    if (winningSquares) {
      winner = current.squares[winningSquares[0]];
    }

    const positions = [
      'row 1, col 1',
      'row 1, col 2',
      'row 1, col 3',
      'row 2, col 1',
      'row 2, col 2',
      'row 2, col 3',
      'row 3, col 1',
      'row 3, col 2',
      'row 3, col 3'
    ];

    let moves = history.map((step, move) => {
      let position
      if (move) {
        const prev = history[move - 1].squares;
        let change;
        for(let i = 0; i < 10; i ++) {
          if (step.squares[i] !== prev[i]) {
            change = i;
            break;
          }
        }
        position = positions[change];
      }

      let desc = move ?
        'Go to move #' + move + ': ' + position :
        'Go to start of game';

      if (move === this.state.stepNumber) {
        desc = <b>{desc}</b>;
      }

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );

    });

    if (!this.state.sortNatural) {
      let reversedMoves = [];
      for (let i = moves.length - 1; i > -1; i--) {
        reversedMoves.push(moves[i]);
      }
      moves = reversedMoves;
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    if (!current.squares.includes(null)) {
      status = 'Draw';
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
           squares={current.squares}
           winningSquares={winningSquares ? winningSquares : []}
           onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={ () => this.toggleOrder() }>Toggle order of moves</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinningSquares(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

