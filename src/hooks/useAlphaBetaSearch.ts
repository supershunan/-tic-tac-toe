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
    const player = (squareMap.size + 1) % 2 === 0;
    const newResult = startAI(squareMap, -Infinity, Infinity, player, gameSetting);
    return newResult;
};

/**
 * AI 算法 α-β剪枝
 * @param squareMap 棋盘数据
 * @param elfa α 电脑的权重
 * @param beta β 人的权重
 * @param player 当前下棋者
 * @param gameSetting 游戏配置
 * @returns object
 */
const startAI = (squareMap: PiecesMapType, elfa: number, beta: number, player: boolean, gameSetting: GameSettings) => {
    const boardVacancys = getBoardVacancys(squareMap, gameSetting.boardLength);
    const lastEntry = [...squareMap.entries()].pop();
    const win = lastEntry && checkWinner(squareMap, gameSetting.boardLength, gameSetting.victoryBaseReason, lastEntry[1].direction);

    if (boardVacancys.length === 0 || win) {
        
        return 0;
    }
    
    if (player) {
        for (let i = 0; i < boardVacancys.length; i++) {

        }
    } else {

    }

    /**
     * 获取棋盘当前空位
     * @param squareMap 当前棋盘数据
     */
    function getBoardVacancys (squareMap: PiecesMapType, boardLength: number): Array<Array<number | null>> {
        let boardVacancys: Array<Array<number | null>> = [];
        for(let i = 0; i < boardLength; i++) {
            for(let j = 0; j < boardVacancys.length; j++) {
                const stringDirect = JSON.stringify([i, j]);
                if (!squareMap.has(stringDirect)) {
                    boardVacancys.push([i, j]);
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
        return usePieces(squareMap, boardLength, victoryBaseReason, curentDirection)
    }
    return {}
}

export default useAlphaBetaSearch;
