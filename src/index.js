import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Square extends React.Component {
    render() {
        return (
            <button
                className="square"
                onClick={() => this.props.onClick()}
            >
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            squares: Array(this.props.row * this.props.col).fill(null),
            xIsNext: true,
            status: 'Next player: X',
            isWon: false
        }
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        if (squares[i] || this.state.isWon) {
            return
        }
        squares[i] = this.state.xIsNext ? "X" : "O";

        let winner = calculateWinner(squares, i, this.props.row, this.props.col)
        if (winner) {
            this.setState({
                squares: squares,
                xIsNext: !this.state.xIsNext,
                status: 'Winner: ' + winner,
                isWon: true
            });
            return
        }

        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
            status: 'Next player: ' + (!this.state.xIsNext ? 'X' : 'O')
        });
    }

    render() {
        const arrRow = Array(this.props.row)
        const arrCol = Array(this.props.col)
        for (let i = 0; i < (this.props.row * this.props.col); i++) {
            if (i < this.props.row) {
                arrRow[i] = i
            }
            if (i < this.props.col) {
                arrCol[i] = i
            }
        }

        return (
            <div>
                <div className="status">{this.state.status}</div>
                {
                    arrRow.map((valRow, index) => {
                        return (
                            <div className="board-row" key={index}>
                                {
                                    arrCol.map((valCol, index) =>
                                        <Square
                                            key={index}
                                            value={this.state.squares[valRow * arrCol.length + valCol]}
                                            // value={valRow * arrCol.length + valCol}
                                            onClick={() => this.handleClick(valRow * arrCol.length + valCol)}
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
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board row={15} col={15} />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
