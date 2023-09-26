/**
 * 游戏配置
 * @param name 游戏名字
 * @param name 游戏类型
 * @param boardLength 棋盘宽度
 * @param victoryBaseReason 游戏胜利的基础条件
 * @param chessType 棋子类型
 */
export interface GameSettings {
    name: string;
    type: string;
    boardLength: number;
    victoryBaseReason: number;
    chessType: Array<string>;
}

/**
 * 存储棋盘的类型
 */
export type PiecesMapType = Map<number, { direction: Array<number>, content: string, key: number }>

/**
 * 游戏配置
 * @param name 游戏名字
 * @param board 棋盘宽度
 * @param victoryBaseReason 游戏胜利的基础条件
 * @param chessType 棋子类型
 */
type GameSetting = {
    name: string;
    type: string;
    boardLength: number;
    victoryBaseReason: number;
    chessType: Array<string>;
}

/**
 * @param gameSetting 游戏配置
 */
export interface GameProps {
    gameSetting: GameSetting;
}

/**
 * @param key 游戏唯一标识
 * @param currentGameMove 游戏当前位置
 * @param historyGameMap 棋盘数据
 * @param jumpPlace 历史位置
 * @param gameType 游戏类型
 */

export type Game = {
    historyGameMap: {
        [key: string]: {
            currentGameMove: number;
            historyGameMap: PiecesMapType;
            jumpPlace: number;
            gameType: string;
        };
    };
}

/**
 * redux 存储游戏
 */
export interface GameStore {
    game: Game;
}
/**
 * @param gameSetting 游戏配置
 * @param squares 棋盘数据
 * @param addNewPieces 添加新棋子
 * @param jumpPlace 历史步骤
 */
export interface BoardProps {
    gameSetting: GameSetting;
    squares: PiecesMapType;
    addNewPieces: (index: PiecesMapType) => void;
    jumpPlace: number;
}

/**
 * @param content 格子的内容
 * @param onSquareClick 点击格子
 */
export interface SquareProps {
    content: string | null | undefined;
    onSquareClick: () => void;
}
