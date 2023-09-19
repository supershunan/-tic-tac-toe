import React, { useState } from 'react';
import './App.less';

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
    onPlay: (value: Array<string | null>) => void;
}

/**
 * 数组转换
 * @param array 棋盘格数组
 * @param chunkSize 棋盘格分割为以chunkSize为单位的数组
 * @returns
 */
const chunkArray = (array: Array<string | null>, chunkSize: number) => {
    const result = [];
    for (let smallI = 0; smallI < array.length; smallI += chunkSize) {
        result.push(array.slice(smallI, smallI + chunkSize));
    }

    return result;
};
/**
 * 判断是否胜出
 * @param {Array<string | null>} ary 棋盘格的数组
 * @param {number} pieces 棋盘格大小 n*n
 * @param {boolean} pieceType 棋盘类型 true 井字棋 false 五子棋
 */
const calculateWinner = (ary: Array<string | null>, pieces: number, pieceType: boolean) => {
    const newAry = chunkArray(ary, pieces);
    const piecesTypeNum = pieceType ? 3 : 5;
    let result;

    for (let smallI = 0; smallI < newAry.length; smallI++) {
        for (let smallJ = 0; smallJ < newAry[smallI].length; smallJ++) {
            if (newAry[smallI][smallJ] !== null) {
                // 水平方向
                deepRecursion(smallI, smallJ, 1, newAry[smallI][smallJ], [1, 0]);
                // 垂直方向
                deepRecursion(smallI, smallJ, 1, newAry[smallI][smallJ], [0, 1]);
                // 从左上到右下的对角线
                deepRecursion(smallI, smallJ, 1, newAry[smallI][smallJ], [1, 1]);
                // 从右上到左下的对角线
                deepRecursion(smallI, smallJ, 1, newAry[smallI][smallJ], [-1, 1]);
            }
        }
    }

    /**
     * 深度递归
     * @param xAxis x轴
     * @param yAxis y轴
     * @param sameNum 相同的数目
     * @param target 目标格子的值
     * @param direction 移动的方向
     * @returns
     */
    function deepRecursion (xAxis: number, yAxis: number, sameNum: number, target: string | null, direction: Array<number>) {
        if (target === null) {
            return;
        }
        if (sameNum === piecesTypeNum) {
            result = target;
            return;
        }

        const [newX, newY] = direction;
        const nextX = xAxis + newX;
        const nextY = yAxis + newY;
        if (nextX < pieces && nextY < pieces && nextX > -1 && nextY > -1 && newAry[nextX][nextY] === target) {
            deepRecursion(nextX, nextY, sameNum + 1, target, direction);
        }
    }
    return result;
};

/**
 * 格子
 * @param {number} value 格子内的值
 * @param {boolean} pieceType 棋盘类型 true 井字棋 false 五子棋
 * @param {() => void} onSquareClick 点击格子事件
 * @returns
 */
const Square: React.FC<SquareProps> = (props) => {
    const { value, onSquareClick, pieceType } = props;
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
 * @returns
 */
const Board: React.FC<BoardProps> = (props) => {
    const { pieces, pieceType, squares, xIsNext, onPlay } = props;
    /**
     *
     * @param value 点击的第几个
     * @returns
     */
    const handleClick = (value: number) => {
        if (calculateWinner(squares, pieces, pieceType) || squares[value]) {
            return;
        }
        const nextSquares = squares.slice();
        if (pieceType) {
            xIsNext ? nextSquares[value] = 'X' : nextSquares[value] = 'O';
        } else {
            xIsNext ? nextSquares[value] = '⚫' : nextSquares[value] = '⚪';
        }
        // 添加新数组
        onPlay(nextSquares);
    };
    // render 棋盘的时候判断获胜者
    const winner = calculateWinner(squares, pieces, pieceType);
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
                        onSquareClick={() => handleClick(num)}
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
const Game = () => {
    // true 井字棋 false 五子棋
    const [pieceType, setPieceType] = useState<boolean>(true);
    const [history, setHistory] = useState([Array(9).fill(null)]);
    // 记录历史数据
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    /**
     *
     */
    const changeType = () => {
        const result = window.confirm('确认切换游戏类型？');
        if (result) {
            // 重新初始化
            if (pieceType) {
                setHistory([Array(15 * 15).fill(null)]);
            } else {
                setHistory([Array(3 * 3).fill(null)]);
            }
            setCurrentMove(0);
            setPieceType(!pieceType);
        }
    };
    /**
     *
     */
    const reStart = () => {
        if (!pieceType) {
            setHistory([Array(15 * 15).fill(null)]);
        } else {
            setHistory([Array(3 * 3).fill(null)]);
        }
        setCurrentMove(0);
    };
    /**
     *
     * @param nextSquares
     */
    const handlePlay = (nextSquares: Array<string | null>) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    };
    /**
     *
     * @param nextMove
     */
    const jumpTo = (nextMove: number) => {
        setCurrentMove(nextMove);
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

    return (
        <div className="game">
            <button className="game-btn" onClick={changeType}>
                {
                    pieceType ? '切换为五子棋' : '切换为井字棋'
                }
            </button>
            <button className="game-btn" onClick={reStart}>重新开始</button>
            <div className="game-content">
                <div className="game-board">
                    {
                        pieceType
                            ? <Board pieces={3} pieceType={pieceType} squares={currentSquares} xIsNext={xIsNext} onPlay={handlePlay} />
                            : <Board pieces={15} pieceType={pieceType} squares={currentSquares} xIsNext={xIsNext} onPlay={handlePlay} />
                    }
                </div>
                <div className="game-info">
                    <ol>{moves}</ol>
                </div>
            </div>
        </div>
    );
};
export default Game;
