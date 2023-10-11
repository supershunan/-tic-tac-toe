/**
 * 游戏配置
 * @param name 游戏名字
 * @param name 游戏类型
 * @param boardLength 棋盘宽度
 * @param victoryBaseReason 游戏胜利的基础条件
 * @param chessType 棋子类型
 * @param isAI 是否支持AI
 */
interface GameSettings {
    name: string;
    type: string;
    boardLength: number;
    victoryBaseReason: number;
    chessType: Array<string>;
    isAI?: boolean;
}
const gameSettings: Array<GameSettings> = [
    {
        name: '井字棋',
        type: 'TicTac',
        boardLength: 3,
        victoryBaseReason: 3,
        chessType: ['X', 'O'],
        isAI: true,
    },
    {
        name: '五子棋',
        type: 'GoBang',
        boardLength: 15,
        victoryBaseReason: 5,
        chessType: ['⚫', '⚪'],
        isAI: false,
    },
    // {
    //     name: '十子棋',
    //     type: 'tenBang',
    //     boardLength: 10,
    //     victoryBaseReason: 5,
    //     chessType: ['A', 'B'],
    // }
];

/**
 * 游戏类型
 */
const gameTypes: Array<string> = ['TicTac', 'GoBang'];

/**
 * 对战模式
 */
const AIGames = [
    {
        key: 0,
        value: '玩家先手',
    },
    {
        key: 1,
        value: 'AI先手',
    },
];

/**
 * AI 配置参数
 */
// 玩家局面分数评估
const BOARD_COUNT = {
    horizontal: [0, 0, 0], // 水平
    vertical: [0, 0, 0],   // 垂直
    diagonal: [0, 0],      // 对角线
    cornerControl: 0,      // 控制的角落位置
    centerControl: 0,      // 中心位置控制
};
export { gameSettings, gameTypes, AIGames, BOARD_COUNT };
