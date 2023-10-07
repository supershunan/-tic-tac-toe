import React, { useEffect, useState } from 'react';
import Square from './Square';
import usePieces from '../../hooks/usePieces';
import { BoardProps, PiecesMapType, GameStore } from '../type/index';
import { useSelector } from 'react-redux';

/**
 * 棋盘
 * @param gameSetting 游戏配置
 * @param squares 当前棋盘的数组
 * @param xIsNext 渲染步骤的类型
 * @param addNewPieces 添加新改变的数组
 * @returns
 */
const Board: React.FC<BoardProps> = ({ gameSetting, squares, addNewPieces, jumpPlace }) => {
    const gameStore = useSelector((state: GameStore) => state.game);
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
        judgeWinner();
    }, [gameSetting]);

    /**
     * 切换游戏类型判断胜负
     */
    const judgeWinner = () => {
        setWinner(null);
        setCurrentPieceType(true);
        if (gameStore.historyGameMap[gameSetting.type]) {
            const { historyGameMap } = gameStore.historyGameMap[gameSetting.type];
            const newSquares = new Map(historyGameMap);
            setCurrentPieceType(newSquares.size % 2 === 0);
            const lastEntry = [...newSquares.entries()].pop();
            if (lastEntry && gameSetting.chessType.find(el => el === lastEntry[1].content)) {
                const win = usePieces(newSquares, gameSetting.boardLength, gameSetting.victoryBaseReason, lastEntry[1].direction);
                if (win) {
                    setWinner(win);
                }
            }
        }
    };

    /**
     * 获取当前历史记录前的数据
     * @param jumpPlace 点击的历史记录位置
     */
    const jumpSquares = (jumpPlace: number) => {
        const tempSquares = new Map(squares);
        let selectedItems = new Map();
        if (jumpPlace === -1) {
            selectedItems = tempSquares;
        } else {
            let count = 0;
            for (const [key, value] of tempSquares) {
                if (count < jumpPlace) {
                    selectedItems.set(key, value);
                    count++;
                } else {
                    break;
                }
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
     * @param stingCoordinate 棋子坐标字符串
     * @param pieceCoordinate 棋子坐标
     * @returns
     */
    const handleClick = (stingCoordinate: string, pieceCoordinate: Array<number>) => {
        const piecesData = {
            direction: pieceCoordinate,
            content: '',
            key: stingCoordinate,
        };
        const newSquares =  historySquares ? historySquares : squares;
        piecesData.content = currentPieceType ? gameSetting.chessType[0] : gameSetting.chessType[1];
        const isExist = historySquares ? historySquares?.get(stingCoordinate) : squares?.get(stingCoordinate);

        if (winner || isExist) {
            return;
        }
        newSquares.set(stingCoordinate, piecesData);

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
    /**
     * 给整个棋盘添加点击事件，通过监听数据触发渲染
     * @param event dom事件
     */
    const handleBoardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = event.target as HTMLButtonElement;
        const piecCoordinate = JSON.parse(target.getAttribute('data-direction') as string);
        const stingCoordinate = piecCoordinate !== null && JSON.stringify(piecCoordinate);
        const isExecute = (Array.isArray(piecCoordinate) && piecCoordinate.length === 2);
        if (isExecute) {
            handleClick(stingCoordinate as string, piecCoordinate);
        }
    };

    const listSquars = Array.from({ length: gameSetting.boardLength }, (__, index) => (
        <div key={index} className="board-row">
            {Array.from({ length: gameSetting.boardLength }, (__, smallI) => {
                // 坐标转为字符串作为唯一的key
                const stingCoordinate = JSON.stringify([index, smallI]);

                return (
                    <Square
                        key={JSON.stringify([index, smallI])}
                        content={historySquares ? historySquares?.get(stingCoordinate)?.content : squares?.get(stingCoordinate)?.content}
                        direction={stingCoordinate}
                    />
                );
            })}
        </div>
    ));
    return (
        <div>
            <div className="user">{status}</div>
            <div onClick={handleBoardClick}>
                {listSquars}
            </div>
        </div>
    );
};

export default Board;
