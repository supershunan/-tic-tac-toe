import { useEffect, useState } from 'react';
import Square from './Square';
import usePieces from '../../hooks/usePieces';

type GameSetting = {
    name: string;
    type: string;
    boardLength: number;
    victoryBaseReason: number;
    chessType: Array<string>;
}
type PiecesMapType =  Map<number, { direction: Array<number>, content: string, key: number }>;
interface BoardProps {
    gameSetting: GameSetting;
    squares: PiecesMapType;
    addNewPieces: (index: PiecesMapType) => void;
    jumpPlace: number;
}

/**
 * 棋盘
 * @param gameSetting 游戏配置
 * @param squares 当前棋盘的数组
 * @param xIsNext 渲染步骤的类型
 * @param addNewPieces 添加新改变的数组
 * @returns
 */
const Board: React.FC<BoardProps> = ({ gameSetting, squares, addNewPieces, jumpPlace }) => {
    const [historySquares, setHistorySquares] = useState<PiecesMapType | null>(null);
    // 计算了当前棋子是第几步并用于显示棋子类型
    const [currentPieceType, setCurrentPieceType] = useState<boolean>();
    const [winner, setWinner] = useState<string | null | undefined>(null);
    let status: string;

    if (winner) {
        status = `获胜者为: ${winner}`;
    } else {
        if (squares.size < gameSetting.boardLength * gameSetting.boardLength) {
            status = `本次下棋者为: ${(currentPieceType ? gameSetting.chessType[0] : gameSetting.chessType[1])}`;
        } else {
            status = '平局';
        }
    }

    useEffect(() => {
        jumpSquares(jumpPlace);
    }, [jumpPlace]);

    useEffect(() => {
        setWinner(null);
        const newSquares = new Map(squares);
        const lastEntry = [...newSquares.entries()].pop();
        if (lastEntry && gameSetting.chessType.find(el => el === lastEntry[1].content)) {
            const win = usePieces(newSquares, gameSetting.boardLength, gameSetting.victoryBaseReason, lastEntry[1].direction);
            if (win) {
                setWinner(win);
            }
        }
    }, [gameSetting, squares]);

    /**
     * 获取当前历史记录前的数据
     * @param jumpPlace 点击的历史记录位置
     */
    const jumpSquares = (jumpPlace: number) => {
        const tempSquares = new Map(squares);
        const selectedItems = new Map();
        let count = 0;
        for (const [key, value] of tempSquares) {
            if (count < jumpPlace) {
                selectedItems.set(key, value);
                count++;
            } else {
                break;
            }
        }
        setWinner(null);
        // 判断当前的胜负
        const lastEntry = [...selectedItems.entries()].pop();
        if (lastEntry) {
            const win = usePieces(selectedItems, gameSetting.boardLength, gameSetting.victoryBaseReason, lastEntry[1].direction);
            if (win) {
                setWinner(win);
            }
        }
        setCurrentPieceType(selectedItems.size % 2 === 0);
        setHistorySquares(selectedItems);
    };

    /**
     *
     * @param index 棋子位置(按序排列)
     * @param pieceCoordinate 棋子坐标
     * @returns
     */
    const handleClick = (index: number, pieceCoordinate: Array<number>) => {
        const piecesData = {
            direction: pieceCoordinate,
            content: '',
            key: index,
        };
        const newSquares = new Map(historySquares ? historySquares : squares);
        piecesData.content = currentPieceType ? gameSetting.chessType[0] : gameSetting.chessType[1];
        const isExist = historySquares ? historySquares?.get(index) : squares?.get(index);
        if (winner || isExist) {
            return;
        }

        // 正常添加棋子和判断胜负
        newSquares.set(index, piecesData);

        // 使用封装好的棋盘hook
        const win = usePieces(newSquares, gameSetting.boardLength, gameSetting.victoryBaseReason, pieceCoordinate);
        if (win) {
            setWinner(win);
            addNewPieces(newSquares);
            return;
        }
        setCurrentPieceType(newSquares.size % 2 === 0);
        // 添加新数组
        addNewPieces(newSquares);
        // 历史记录清空
        setHistorySquares(null);
    };

    const listSquars = Array.from({ length: gameSetting.boardLength }, (__, index) => (
        <div key={index} className="board-row">
            {Array.from({ length: gameSetting.boardLength }, (__, smallI) => {
                // 为每个格子传递为数组对应的index,此处计算为固定算法，可考虑不追其原因
                const num = index + ((index + 1) * (gameSetting.boardLength - 1)) - (gameSetting.boardLength - 1 - smallI);

                return (
                    <Square
                        key={num}
                        content={historySquares ? historySquares?.get(num)?.content : squares?.get(num)?.content}
                        onSquareClick={handleClick.bind(null, num, [index, smallI])}
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

export default Board;
