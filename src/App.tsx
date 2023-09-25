import React, { memo, useEffect, useState } from 'react';
import './App.less';
import usePieces from './hooks/usePieces';
import { saveHistory, setPieceType, setCurentMove, setCurrentsXY, setSliceCurrentsXY } from './store/game/gameSlice';
import { useDispatch, useSelector } from 'react-redux';


interface SquareProps {
    value: string | null | undefined;
    onSquareClick: () => void;
    pieceType: boolean;
}
interface SliceProps {
    historyTicMap: [number, { direction: number[], content: string, key: number }][];
    historyGoBangMap: [number, { direction: number[], content: string, key: number }][];
    currentTicMove: number;
    currentGoBangMove: number;
    pieceType: boolean;
    currentsTicXY: Array<string | null>;
    currentsGoBangXY: Array<string | null>;
    sliceCurentsTicXY: Array<string>;
    sliceCurentsGoBangXY: Array<string>;
}
interface StateSliceProps {
    ticTacORgoBang: SliceProps;
}
interface BoardProps {
    pieces: number;
    pieceType: boolean;
    squares: Map<number, { direction: Array<number>, content: string, key: number }>;
    resetWinner: boolean;
    onPlay: (value:  Map<number, { direction: Array<number>, content: string, key: number }>) => void;
    sliceCurentsXY: Array<string | null>;
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
// 采用memo提高需渲染性能
const SquareComponent = memo(Square);

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
const Board: React.FC<BoardProps> = ({ pieces, pieceType, squares, resetWinner, sliceCurentsXY, onPlay }) => {
    // render 棋盘的时候判断获胜者，winner 需要在重新开始和切换历史数据进行重置在父组件通过变量判断进行重置
    const [winner, setWinner] = useState<string | null | undefined>(null);
    // 计算了当前棋子是第几步并用于显示棋子类型
    let currentPieceType = (squares.size - sliceCurentsXY.length) % 2 === 0;
    let status: string;
    const dispatch = useDispatch();
    if (winner) {
        status = `获胜者为: ${winner}`;
    } else {
        if (pieceType) {
            status = `本次下棋者为: ${(currentPieceType ? 'X' : 'O')}`;
        } else {
            status = `本次下棋者为: ${(currentPieceType ? '⚫' : '⚪')}`;
        }
    }

    useEffect(() => {
        setWinner(null);
        currentPieceType = (squares.size - sliceCurentsXY.length) % 2 === 0;

        // 切换游戏类型，判断当前游戏记录的胜负状态
        const piecesTypeNum = pieceType ? 3 : 5;
        const newSquares = new Map(squares);
        sliceCurentsXY.length > 0 && deleteLastNEntries(newSquares, sliceCurentsXY.length);
        const lastEntry = [...newSquares.entries()].pop();

        if (lastEntry) {
            const win = usePieces(newSquares, pieces, piecesTypeNum, lastEntry[1].direction);
            if (win) {
                setWinner(win);
            }
        }
    }, [resetWinner]);


    /**
     * 切割Map,删除Map类型指定的后几项
     * @param map Map类型的数据结构
     * @param n 删除的后几项
     */
    const deleteLastNEntries = (map:  Map<number, { direction: Array<number>, content: string, key: number }>, num: number): void => {
        const keysToDelete = Array.from(map.keys()).slice(-num);

        keysToDelete.forEach(key => {
            map.delete(key);
        });
    };

    /**
     *
     * @param value 点击的第几个
     * @returns
     */
    const handleClick = (value: number, currentXY: Array<number>) => {
        const piecesData = {
            direction: currentXY,
            content: '',
            key: value,
        };
        const piecesTypeNum = pieceType ? 3 : 5;
        // 计算了当前棋子是第几步并用于显示棋子类型
        const currentPieceType = (squares.size - sliceCurentsXY.length) % 2 === 0;

        // 点击历史记录后，添加棋子和判断胜负
        if (sliceCurentsXY.length > 0 && squares.size > 0) {
            const newSquares = new Map(squares);
            // 获取点击历史记录当前的historyMap
            deleteLastNEntries(newSquares, sliceCurentsXY.length);

            if (pieceType) {
                currentPieceType  ? piecesData.content = 'X' : piecesData.content = 'O';
            } else {
                currentPieceType  ? piecesData.content = '⚫' : piecesData.content = '⚪';
            }
            newSquares.set(value, piecesData);

            // 使用封装好的棋盘hook
            const win = usePieces(newSquares, pieces, piecesTypeNum, currentXY);

            dispatch(setSliceCurrentsXY([]));
            setWinner(win);
            onPlay(newSquares);

            return;
        }

        if (winner || squares.get(value)) {
            return;
        }

        // 正常添加棋子和判断胜负
        const newMap = new Map(squares);

        if (pieceType) {
            currentPieceType  ? piecesData.content = 'X' : piecesData.content = 'O';
        } else {
            currentPieceType  ? piecesData.content = '⚫' : piecesData.content = '⚪';
        }
        newMap.set(value, piecesData);

        // 使用封装好的棋盘hook
        const win = usePieces(newMap, pieces, piecesTypeNum, currentXY);
        if (win) {
            setWinner(win);
            onPlay(newMap);
            return;
        }
        // 添加新数组
        onPlay(newMap);
    };

    const listSquars = Array.from({ length: pieces }, (__, index) => (
        <div key={index} className="board-row">
            {Array.from({ length: pieces }, (__, smallI) => {
                // 为每个格子传递为数组对应的index,此处计算为固定算法，可考虑不追其原因
                const num = index + ((index + 1) * (pieces - 1)) - (pieces - 1 - smallI);
                return (
                    <SquareComponent
                        key={num}
                        value={sliceCurentsXY.includes([index, smallI].join('')) ? null : squares.get(num)?.content}
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
    const ticTacORgoBang = useSelector((state: StateSliceProps) => state.ticTacORgoBang);
    const dispatch = useDispatch();
    const [historyMap, setHisttoryMap] = useState(pieceType ? new Map(ticTacORgoBang.historyTicMap) : new Map(ticTacORgoBang.historyGoBangMap));
    const [currentsGameXY, setCurrentsGameXY] = useState(pieceType ? ticTacORgoBang.currentsTicXY : ticTacORgoBang.currentsGoBangXY);
    const [sliceCurentsXY, setSliceCurentsXY] = useState<Array<string | null>>(pieceType ? ticTacORgoBang.sliceCurentsTicXY : ticTacORgoBang.sliceCurentsGoBangXY);
    const [currentMove, setCurrentMove] = useState(pieceType ? ticTacORgoBang.currentTicMove : ticTacORgoBang.currentGoBangMove);
    const [resetWinner, setResetWinner] = useState(false);

    /**
     * 重新初始化
     */
    const initGame = () => {
        setResetWinner(!resetWinner);
        setHisttoryMap(pieceType ? new Map(ticTacORgoBang.historyTicMap) : new Map(ticTacORgoBang.historyGoBangMap));
        setCurrentMove(pieceType ? ticTacORgoBang.currentTicMove : ticTacORgoBang.currentGoBangMove);
        setCurrentsGameXY(pieceType ? ticTacORgoBang.currentsTicXY : ticTacORgoBang.currentsGoBangXY);
        setSliceCurentsXY(pieceType ? ticTacORgoBang.sliceCurentsTicXY : ticTacORgoBang.sliceCurentsGoBangXY);
    };
    /**
     * 重新开始
     */
    const reStart = () => {
        setResetWinner(!resetWinner);
        setHisttoryMap(new Map());
        setCurrentMove(0);
        setCurrentsGameXY([]);
        setSliceCurentsXY([]);
    };
    /**
     * 处理当前棋盘数组
     * @param nextSquares
     */
    const handlePlay = (nextSquares: Map<number, { direction: Array<number>, content: string, key: number }>) => {
        const newCurrentXY: Array<string> = [];
        nextSquares.forEach((value) => {
            const currentStr = value.direction;
            newCurrentXY.push(currentStr.join(''));
        });

        setHisttoryMap(new Map(nextSquares));
        setCurrentMove(nextSquares.size);
        setCurrentsGameXY(newCurrentXY);
        // 由于使用redux存储数据出现异步，故在点击后重置
        setSliceCurentsXY([]);
    };
    /**
     * 历史点击
     * @param nextMove 步骤
     */
    const jumpTo = (nextMove: number) => {
        setResetWinner(!resetWinner);
        setSliceCurentsXY(currentsGameXY.slice(nextMove));
    };

    // 历史步骤
    const moves = Array(currentMove + 1).fill(null)
        .map((squares: Array<string | null>, move: number) => {
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
        // redux 存储数据
        dispatch(saveHistory(Array.from(historyMap)));
        dispatch(setCurentMove(currentMove));
        dispatch(setSliceCurrentsXY(sliceCurentsXY));
        dispatch(setCurrentsXY(currentsGameXY));
        dispatch(setPieceType(pieceType));
        // 初始化
        initGame();
    }, [pieceType, pieces]);

    return (
        <div className="game">
            <div className="game-content">
                <div className="game-board">
                    <Board pieces={pieces} pieceType={pieceType} squares={historyMap}
                        resetWinner={resetWinner} sliceCurentsXY={sliceCurentsXY} onPlay={handlePlay} />
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
