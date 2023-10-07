import { PiecesMapType } from '../game/type/index';
import usePieces from './usePieces';
interface GameSettings {
    name: string;
    type: string;
    boardLength: number;
    victoryBaseReason: number;
    chessType: Array<string>;
}
/**
 * 入口函数
 * @param squareMap 棋盘数据
 * @param gameSetting 游戏配置
 * @returns object
 */
const useAlphaBetaSearch = (squareMap: PiecesMapType, gameSetting: GameSettings) => {
    const newResult = startAI(squareMap, -Infinity, Infinity, true, gameSetting);
    return newResult;
};

/**
 * AI 算法 α-β剪枝
 * @param squareMap 棋盘数据
 * @param alfa α 当前节点的权重
 * @param beta β 对方节点的权重
 * @param player 当前节点，true 为本节点，false 为对方节点
 * @param gameSetting 游戏配置
 * @returns object
 */
const startAI = (squareMap: PiecesMapType, alfa: number, beta: number, player: boolean, gameSetting: GameSettings): any => {
    const boardVacancys = getBoardVacancys(squareMap, gameSetting.boardLength);
    const lastEntry = [...squareMap.entries()].pop();
    const win = lastEntry && checkWinner(squareMap, gameSetting.boardLength, gameSetting.victoryBaseReason, lastEntry[1].direction);

    if (boardVacancys.length === 0 || win) {
        const score = lastEntry && finalScore(squareMap, gameSetting.boardLength, gameSetting.victoryBaseReason, lastEntry[1].direction, gameSetting);
        return { score };
    }

    let bestMove;
    if (player) {
        bestMove = { score: -Infinity };
        for (let num = 0; num < boardVacancys.length; num++) {
            const [xx, yy] = boardVacancys[num];
            const piecesData = {
                direction: [xx, yy],
                content: (player ? gameSetting.chessType[0] : gameSetting.chessType[1]),
                key: JSON.stringify([xx, yy]),
            };
            squareMap.set(JSON.stringify([xx, yy]), piecesData);
            const move = startAI(squareMap, alfa, beta, false, gameSetting);
            squareMap.delete(JSON.stringify([xx, yy]));
            move.xx = xx;
            move.yy = yy;
            if (move.score > bestMove.score) {
                bestMove = move;
            }
            alfa = Math.max(alfa, bestMove.score);
            if (beta <= alfa) {
                break;
            }
        }
    } else {
        bestMove = { score: Infinity };
        for (let num = 0; num < boardVacancys.length; num++) {
            const [xx, yy] = boardVacancys[num];
            const piecesData = {
                direction: [xx, yy],
                content: (player ? gameSetting.chessType[0] : gameSetting.chessType[1]),
                key: JSON.stringify([xx, yy]),
            };
            squareMap.set(JSON.stringify([xx, yy]), piecesData);
            const move = startAI(squareMap, alfa, beta, true, gameSetting);
            squareMap.delete(JSON.stringify([xx, yy]));
            move.xx = xx;
            move.yy = yy;
            if (move.score > bestMove.score) {
                bestMove = move;
            }
            alfa = Math.min(beta, bestMove.score);
            if (beta <= alfa) {
                break;
            }
        }
    }

    return bestMove;
};

/**
     * 获取棋盘当前空位
     * @param squareMap 当前棋盘数据
     */
function getBoardVacancys (squareMap: PiecesMapType, boardLength: number): Array<Array<number>> {
    const boardVacancys: Array<Array<number>> = [];
    for (let xx = 0; xx < boardLength; xx++) {
        for (let yy = 0; yy < boardLength; yy++) {
            const stringDirect = JSON.stringify([xx, yy]);
            if (!squareMap.has(stringDirect)) {
                boardVacancys.push([xx, yy]);
            }
        }
    }
    return boardVacancys;
}
/**
 * 检测当前输赢
 * @param squareMap 棋盘数据
 * @param boardLength 棋盘长度
 * @param victoryBaseReason 获胜条件
 * @param curentDirection 当前棋子位置
 * @returns string null undefined
 */
function checkWinner (squareMap: PiecesMapType, boardLength: number, victoryBaseReason: number, curentDirection: Array<number>) {
    const winner = usePieces(squareMap, boardLength, victoryBaseReason, curentDirection);
    if (winner) {
        return true;
    } else {
        return false;
    }
}
/**
 * 检测当前输赢
 * @param squareMap 棋盘数据
 * @param boardLength 棋盘长度
 * @param victoryBaseReason 获胜条件
 * @param curentDirection 当前棋子位置
 * @param gameSetting 棋盘配置
 * @returns number
 */
function finalScore (squareMap: PiecesMapType, boardLength: number, victoryBaseReason: number, curentDirection: Array<number>, gameSetting: GameSettings) {
    const winner = usePieces(squareMap, boardLength, victoryBaseReason, curentDirection);
    const currentPiece = (squareMap.size % 2 === 0) ? gameSetting.chessType[0] : gameSetting.chessType[1];
    if (winner && winner === currentPiece) {
        return Infinity;
    } else if (winner) {
        return -Infinity;
    } else {
        return 0;
    }
}

export default useAlphaBetaSearch;
