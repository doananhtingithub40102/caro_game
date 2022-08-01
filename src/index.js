import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const Square = (props) => {
    return (
        <button
            className="square"
            onClick={() => props.onClick()}
        >
            {props.value}
        </button>
    );
}

const Board = (props) => {
    const arrRow = Array(props.row)
    const arrCol = Array(props.col)
    for (let i = 0; i < (props.row * props.col); i++) {
        if (i < props.row) {
            arrRow[i] = i
        }
        if (i < props.col) {
            arrCol[i] = i
        }
    }

    return (
        <div>
            {
                arrRow.map((valRow, index) => {
                    return (
                        <div className="board-row" key={index}>
                            {
                                arrCol.map((valCol, index) =>
                                    <Square
                                        key={index}
                                        value={props.squares[valRow * arrCol.length + valCol]}
                                        onClick={() => props.onClick(valRow * arrCol.length + valCol)}
                                    />
                                )
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(this.props.row * this.props.col).fill(null)
            }],
            xIsNext: true,
            isWon: false,
            stepNumber: 0
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()
        if (squares[i]) {
            return
        }
        if (this.state.isWon) {
            const lastStep = this.state.history.length - 1
            if (this.state.stepNumber === lastStep) {
                return
            }
        }
        squares[i] = this.state.xIsNext ? "X" : "O";

        let winner = calculateWinner(squares, i, this.props.row, this.props.col)
        let isWon
        if (winner) {
            isWon = true
        } else {
            isWon = false
        }
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext,
            isWon: isWon,
            stepNumber: history.length
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        let lastStep = this.state.history.length - 1
        if (this.state.isWon && this.state.stepNumber === lastStep) {
            status = "Winner: " + (this.state.xIsNext ? "O" : "X");
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        row={this.props.row}
                        col={this.props.col}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game row={15} col={15} />);

function calculateWinner(squares, i, row, col) {
    const lines = [
        // horizontal
        [i, i + 1, i + 2, i + 3, i + 4],
        [i - 1, i, i + 1, i + 2, i + 3],
        [i - 2, i - 1, i, i + 1, i + 2],
        [i - 3, i - 2, i - 1, i, i + 1],
        [i - 4, i - 3, i - 2, i - 1, i],

        // vertical
        [i, i + col, i + (col * 2), i + (col * 3), i + (col * 4)],
        [i - col, i, i + col, i + (col * 2), i + (col * 3)],
        [i - (col * 2), i - col, i, i + col, i + (col * 2)],
        [i - (col * 3), i - (col * 2), i - col, i, i + col],
        [i - (col * 4), i - (col * 3), i - (col * 2), i - col, i],

        // primary diagonal
        [i, i + (col + 1), i + ((col + 1) * 2), i + ((col + 1) * 3), i + ((col + 1) * 4)],
        [i - (col + 1), i, i + (col + 1), i + ((col + 1) * 2), i + ((col + 1) * 3)],
        [i - ((col + 1) * 2), i - (col + 1), i, i + (col + 1), i + ((col + 1) * 2)],
        [i - ((col + 1) * 3), i - ((col + 1) * 2), i - (col + 1), i, i + (col + 1)],
        [i - ((col + 1) * 4), i - ((col + 1) * 3), i - ((col + 1) * 2), i - (col + 1), i],

        // secondary diagonal
        [i, i + (col - 1), i + ((col - 1) * 2), i + ((col - 1) * 3), i + ((col - 1) * 4)],
        [i - (col - 1), i, i + (col - 1), i + ((col - 1) * 2), i + ((col - 1) * 3)],
        [i - ((col - 1) * 2), i - (col - 1), i, i + (col - 1), i + ((col - 1) * 2)],
        [i - ((col - 1) * 3), i - ((col - 1) * 2), i - (col - 1), i, i + (col - 1)],
        [i - ((col - 1) * 4), i - ((col - 1) * 3), i - ((col - 1) * 2), i - (col - 1), i]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d, e] = lines[i];
        if (squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c] &&
            squares[a] === squares[d] &&
            squares[a] === squares[e]
        ) {
            // Check special case
            if ((i >= 0 && i <= 4) || (i >= 10 && i <= 14)) {
                let isWon = true
                if (i >= 0 && i <= 4) {
                    row = row - 1
                } else if (i >= 10 && i <= 14) {
                    row = row - 5
                }
                for (let r = 0; r < row; r++) {
                    if (a === ((col - 4) + (col * r)) ||
                        a === ((col - 3) + (col * r)) ||
                        a === ((col - 2) + (col * r)) ||
                        a === ((col - 1) + (col * r))
                    ) {
                        isWon = false
                        break
                    }
                }
                if (!isWon) {
                    break
                }
            } else if (i >= 15) {
                let isWon = true
                for (let r = 0; r < row - 3; r++) {
                    if (a === (0 + (col * r)) ||
                        a === (1 + (col * r)) ||
                        a === (2 + (col * r)) ||
                        a === (3 + (col * r))
                    ) {
                        isWon = false
                        break
                    }
                }
                if (!isWon) {
                    break
                }
            }

            // return winner
            return squares[a];
        }
    }
    return null;
}
