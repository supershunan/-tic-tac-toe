import React from 'react';
import './App.less';
import usePieces from './hooks/usePieces';

interface ChooseGameStateType {
    pieces: number;
    pieceType: boolean;
}

interface GameStateType extends ChooseGameStateType {
    history: Array<Array<string | null>>;
    currentMove: number;
    // xIsNext: boolean;
    // currentSquares: Array<string | null>;
    resetWinner: boolean;
}

interface BoardStateType extends ChooseGameStateType {
    squares: Array<string | null>;
    xIsNext: boolean;
    resetWinner: boolean;
    onPlay: (value: Array<string | null>) => void;
}

interface SquareStateType {
    pieceType: boolean;
    value: string | null;
    onSquareClick: () => void;
}


/**
 * 格子
 */
class Square extends React.Component<SquareStateType, {}> {
    constructor (props: SquareStateType) {
        super(props);
    }
    render (): React.ReactNode {
        const { value, pieceType, onSquareClick } = this.props;
        return (
            pieceType
                ? <button className="square" onClick={onSquareClick}>
                    {value}
                </button>
                : <button className="square-gobang" onClick={onSquareClick}>
                    <div className="diagonal-line diagonal-line1"></div>
                    <div className="diagonal-line diagonal-line2"></div>
                    <p className="text">{value}</p>
                </button>
        );
    }
}

/**
 * 棋盘
 */
class Board extends React.Component<BoardStateType, {winner: string | null | undefined}> {
    constructor (props: BoardStateType) {
        super(props);
        this.state = {
            winner: null,
        };
    }
    /**
     *
     * @param prevProps
     */
    componentDidUpdate (prevProps: Readonly<BoardStateType>): void {
        if (this.props.resetWinner !== prevProps.resetWinner) {
            this.setState({
                winner: null,
            });
        }
    }

    /**
     *
     * @param value 点击的第几个
     * @returns
     */
    handleClick = (value: number, currentXY: Array<number>) => {
        const { pieces, pieceType, xIsNext, squares, onPlay } = this.props;
        if (this.state.winner || squares[value]) {
            return;
        }
        const nextSquares = squares.slice();
        if (pieceType) {
            xIsNext ? nextSquares[value] = 'X' : nextSquares[value] = 'O';
        } else {
            xIsNext ? nextSquares[value] = '⚫' : nextSquares[value] = '⚪';
        }
        const piecesTypeNum = pieceType ? 3 : 5;
        // 使用封装好的棋盘hook
        const win = usePieces(nextSquares, pieces, piecesTypeNum, currentXY);
        if (win) {
         this.setState({
                winner: win,
            });
            onPlay(nextSquares);
            return;
        }
        // 添加新数组
        onPlay(nextSquares);
    };

    render (): React.ReactNode {
        const { pieces, pieceType, squares, xIsNext, resetWinner, onPlay } = this.props;

        let status: string;
        if (this.state.winner) {
            status = `获胜者为: ${this.state.winner}`;
        } else {
            if (pieceType) {
                status = `本次下棋者为: ${(xIsNext ? 'X' : 'O')}`;
            } else {
                status = `本次下棋者为: ${(xIsNext ? '⚫' : '⚪')}`;
            }
        }

        const listSquars = Array.from({ length: pieces }, (__, index) => (
            <div key={index} className="board-row">
                {Array.from({ length: pieces }, (__, smallI) => {
                    // 为每个格子传递为数组对应的index,此处计算为固定算法，可考虑不追其原因
                    const num = index + ((index + 1) * (pieces - 1)) - (pieces - 1 - smallI);
                    return (
                        <Square
                            key={num}
                            value={squares[num]}
                            pieceType={pieceType}
                            onSquareClick={() => this.handleClick(num, [index, smallI])}
                        />
                    );
                })}
            </div>
        ));

        return (
            <div>
                <div className="user">{status}</div>
                {listSquars}
            </div>
        );
    }
}

/**
 * 游戏主体
 */
class Game extends React.Component<ChooseGameStateType, GameStateType> {
    constructor (props: ChooseGameStateType) {
        super(props);
        this.state = {
            pieces: this.props.pieces,
            pieceType: this.props.pieceType,
            history: [Array(this.props.pieces * this.props.pieces).fill(null)],
            currentMove: 0,
            resetWinner: false,
        };
    }
    /**
     * 重新初始化
     */
    initGame = () => {
        this.setState({
            pieces: this.props.pieces,
            pieceType: this.props.pieceType,
            history: [Array(this.props.pieces * this.props.pieces).fill(null)],
            currentMove: 0,
            resetWinner: false,
        });
    };
    /**
     * 重新开始
     */
    reStart = () => {
        this.initGame();
        this.setState({
            resetWinner: !this.state.resetWinner,
        });
    };
    /**
     * 处理当前棋盘数组
     * @param nextSquares
     */
    handlePlay = (nextSquares: Array<string | null>) => {
        const nextHistory = [...this.state.history.slice(0, this.state.currentMove + 1), nextSquares];
        this.setState({
            history: nextHistory,
            currentMove: nextHistory.length - 1,
        });
    };
    /**
     * 历史点击
     * @param nextMove 步骤
     */
    jumpTo = (nextMove: number) => {
        this.setState({
            currentMove: nextMove,
            resetWinner: !this.state.resetWinner,
        });
    };

    /**
     *
     * @param preProps
     */
    componentDidUpdate (preProps: ChooseGameStateType) {
        if (this.props.pieceType !== preProps.pieceType && 
            this.props.pieces!== preProps.pieces
        ) {
            this.initGame();
        }

        if(this.props.pieceType !== preProps.pieceType) {
            this.setState({
                resetWinner: this.state.resetWinner,
            });
        }
    }

    render (): React.ReactNode {
        const { pieceType, history, currentMove, resetWinner } = this.state;
        const xIsNext: boolean = currentMove % 2 === 0;
        const currentSquares: Array<string | null> = history[currentMove];
        // 历史步骤
        const moves = history.map((squares: Array<string | null>, move: number) => {
            let description;
            if (move > 0) {
                description = `Go to move # ${move}`;
            } else {
                description = 'Go to game start';
            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{description}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-content">
                    <div className="game-board">
                        <Board pieces={this.state.pieces} pieceType={pieceType} squares={currentSquares} xIsNext={xIsNext} resetWinner={resetWinner} onPlay={this.handlePlay} />
                    </div>
                    <div className="game-info">
                        <button className="game-btn" onClick={this.reStart}>重新开始</button>
                        <ol>{moves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * 选择棋盘类型
 */
class ChooseGame extends React.Component<{}, ChooseGameStateType> {
    constructor (props: {}) {
        super(props);
        this.state = {
            pieces: 3,
            pieceType: true,
        };
    }

    changeType = () => {
        const result = window.confirm('确认切换游戏类型？');
        if (result) {
            this.setState({
                pieces: this.state.pieceType ? 15 : 3,
                pieceType: !this.state.pieceType,
            });
        }
    }

    render () {
        const { pieces, pieceType } = this.state;
        return (
            <div>
                <button className="game-btn" onClick={this.changeType}>
                    {
                        pieceType ? '切换为五子棋' : '切换为井字棋'
                    }
                </button>
                <Game pieceType={pieceType} pieces={pieces}/>
            </div>
        );
    }
}

export default ChooseGame;
