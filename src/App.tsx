import React, { useEffect, useState } from 'react';
import './App.less';
import usePieces from './hooks/usePieces';
interface SquareProps {
    value: string | null;
    onSquareClick: () => void;
    pieceType: boolean;
}
interface BoardProps {
    pieces: number;
    pieceType: boolean;
    squares: Array<null | string>;
    xIsNext: boolean;
    resetWinner: boolean;
    onPlay: (value: Array<string | null>) => void;
}

interface GameProps {
    pieceType: boolean;
    pieces: number;
}

/**
 * 格子
 * @param {number} value 格子内的值
 * @param {boolean} pieceType 棋盘类型 true 井字棋 false 五子棋
 * @param {() => void} onSquareClick 点击格子事件
 * @returns
 */
const Square: React.FC<SquareProps> = ({ value, onSquareClick, pieceType }) => {
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
};

/**
 * 棋盘
 * @param pieces 棋盘格大小 n*n
 * @param pieceType 棋盘类型
 * @param squares 当前棋盘的数组
 * @param xIsNext 渲染步骤的类型
 * @param onPlay 添加新改变的数组
 * @param resetWinner 重置winner的中介
 * @returns
 */
const Board: React.FC<BoardProps> = ({ pieces, pieceType, squares, xIsNext, resetWinner, onPlay }) => {
    // render 棋盘的时候判断获胜者，winner 需要在重新开始和切换历史数据进行重置在父组件通过变量判断进行重置
    const [winner, setWinner] = useState<string | null | undefined>(null);
    let status: string;
    if (winner) {
        status = `获胜者为: ${winner}`;
    } else {
        if (pieceType) {
            status = `本次下棋者为: ${(xIsNext ? 'X' : 'O')}`;
        } else {
            status = `本次下棋者为: ${(xIsNext ? '⚫' : '⚪')}`;
        }
    }
    useEffect(() => {
        setWinner(null);
    }, [resetWinner]);

    /**
     *
     * @param value 点击的第几个
     * @returns
     */
    const handleClick = (value: number, currentXY: Array<number>) => {
        if (winner || squares[value]) {
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
            setWinner(win);
            onPlay(nextSquares);
            return;
        }
        // 添加新数组
        onPlay(nextSquares);
    };

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
                        onSquareClick={() => handleClick(num, [index, smallI])}
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
};

/**
 * 游戏主体
 * @returns
 */
const Game: React.FC<GameProps> = ({ pieceType, pieces }) => {
    const [history, setHistory] = useState([Array(pieces * pieces).fill(null)]);
    // 记录历史数据
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    const [resetWinner, setResetWinner] = useState(false);

    /**
     * 重新初始化
     */
    const initGame = () => {
        setHistory([Array(pieces * pieces).fill(null)]);
        setCurrentMove(0);
    };
    /**
     * 重新开始
     */
    const reStart = () => {
        initGame();
        setResetWinner(!resetWinner);
    };
    /**
     * 处理当前棋盘数组
     * @param nextSquares
     */
    const handlePlay = (nextSquares: Array<string | null>) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    };
    /**
     * 历史点击
     * @param nextMove 步骤
     */
    const jumpTo = (nextMove: number) => {
        setCurrentMove(nextMove);
        setResetWinner(!resetWinner);
    };

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
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });
    useEffect(() => {
        initGame();
    }, [pieceType, pieces]);

    useEffect(() => {
        setResetWinner(!resetWinner);
    }, [pieceType]);

    return (
        <div className="game">
            <div className="game-content">
                <div className="game-board">
                    <Board pieces={pieces} pieceType={pieceType} squares={currentSquares} xIsNext={xIsNext} resetWinner={resetWinner} onPlay={handlePlay} />
                </div>
                <div className="game-info">
                    <button className="game-btn" onClick={reStart}>重新开始</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        </div>
    );
};

/**
 * 选择棋盘类型
 * @returns
 */
const ChooseGame: React.FC<{}> = () => {
    const [pieces, setPieces] = useState<number>(3);
    // true 井字棋 false 五子棋
    const [pieceType, setPieceType] = useState<boolean>(true);

    /**
     * 切换游戏类型
     */
    const changeType = () => {
        const result = window.confirm('确认切换游戏类型？');
        if (result) {
            setPieces(() => {
                return pieceType ? 15 : 3;
            });
            setPieceType(!pieceType);
        }
    };

    return (
        <div>
            <button className="game-btn" onClick={changeType}>
                {
                    pieceType ? '切换为五子棋' : '切换为井字棋'
                }
            </button>
            <Game pieceType={pieceType} pieces={pieces}/>
        </div>
    );
};
export default ChooseGame;
