/**
 * 游戏配置
 * @param name 游戏名字
 * @param name 游戏类型
 * @param boardLength 棋盘宽度
 * @param victoryBaseReason 游戏胜利的基础条件
 * @param chessType 棋子类型
 */
interface GameSettings {
    name: string;
    type: string;
    boardLength: number;
    victoryBaseReason: number;
    chessType: Array<string>;
}
const gameSettings: Array<GameSettings> = [
    {
        name: '井字棋',
        type: 'TicTac',
        boardLength: 3,
        victoryBaseReason: 3,
        chessType: ['X', 'O'],
    },
    {
        name: '五子棋',
        type: 'GoBang',
        boardLength: 15,
        victoryBaseReason: 5,
        chessType: ['⚫', '⚪'],
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

export { gameSettings, gameTypes };
