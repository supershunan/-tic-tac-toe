import { PiecesMapType } from '../game/type/index';
import usePieces from './usePieces';
import { BOARD_COUNT } from '../game-setting';

/**
 * @param score 分数
 * @param counts 各个方向的信息总数
 */
interface boardCountInfo {
    score: number;
    counts: typeof BOARD_COUNT;
}
/**
 * @param row 横坐标
 * @param col 纵坐标
 * @param score 最佳分数
 */
interface bestMoveProps {
    row?: number;
    col?: number;
    score: number;
}

const EMPTY_CELL = '-';
let DEPTH = 2;
let PLAYER_CURRENT: string;
let PLAYER_OPPONENT: string;

/**
 * 计算AI的下棋位置
 * @param board 棋盘数组
 * @param isFirstAI AI是否先手
 * @returns { row: number, col: number }
 */
const useAIService = (board: PiecesMapType, isFirstAI: boolean): { row: number, col: number } => {
    // 将 Map 类型的前数据转换为数组结构
    const newBoads = convertToBoard(board);
    // 当前玩家类型
    PLAYER_CURRENT = isFirstAI ? 'X' : 'O';
    // 对手玩家类型
    PLAYER_OPPONENT = !isFirstAI ? 'X' : 'O';
    // 如果出现一次就能赢的局面
    const emptyCells = getAvailableBoards(newBoads);
    if (emptyCells.length <= 5) {
        for (const move of emptyCells) {
            const { row, col } = move;
            newBoads[row][col] = PLAYER_CURRENT;
            if (usePieces(board, 3, 3, [row, col])) {
                return { row, col };
            }
            newBoads[row][col] = EMPTY_CELL;
        }
    }
    const bestMove = minimax(newBoads, true, -Infinity, Infinity, DEPTH);
    const { row, col } = bestMove;
    DEPTH += 1;
    return { row: row as number, col: col as number };
};

/**
 * 递归的剪枝算法
 * @param board 棋盘数组
 * @param maximizingPlayer 当前下棋者，以AI的视角评估下棋者
 * @param alpha  α 当前节点的权重
 * @param beta   β 对方节点的权重
 * @param depth 递归深度
 * @returns { row, col, score } 最佳AI点位
 */
const minimax = (board: Array<Array<string>>, maximizingPlayer: boolean, alpha: number, beta: number, depth: number): bestMoveProps => {
    // 递归跳出
    const emptyCells = getAvailableBoards(board);
    if (depth === 0 || isGameOver(board) || emptyCells.length === 0) {
        return { score: evaluateBoard(board) };
    }

    let bestMove = null;
    if (maximizingPlayer) {
        // 当前落子
        bestMove = { score: -Infinity };
        for (const move of emptyCells) {
            const { row, col } = move;
            board[row][col] = PLAYER_CURRENT;
            const currentMoce = minimax(board, false, alpha, beta, depth - 1);
            board[row][col] = EMPTY_CELL;
            currentMoce.row = row;
            currentMoce.col = col;
            bestMove = currentMoce.score > bestMove.score ? currentMoce : bestMove;
            alpha = Math.max(alpha, bestMove.score);
            if (alpha >= beta) {
                break;
            }
        }
    } else {
        // 对方落子
        bestMove = { score: Infinity };
        for (const move of emptyCells) {
            const { row, col } = move;
            board[row][col] = PLAYER_OPPONENT;
            const currentMoce = minimax(board, true, alpha, beta, depth - 1);
            board[row][col] = EMPTY_CELL;
            currentMoce.row = row;
            currentMoce.col = col;
            bestMove = currentMoce.score < bestMove.score ? currentMoce : bestMove;
            beta = Math.min(beta, bestMove.score);
            if (alpha >= beta) {
                break;
            }
        }
    }
    return bestMove;
};

/**
 * 判断游戏是否结束
 * @param board 棋盘数组
 * @returns 游戏进行程度
 */
const isGameOver = (board: Array<Array<string>>): boolean => {
    if (checkWinner(board) === EMPTY_CELL) return false;
    return true;
};

/**
 * 使用位运算法检查胜负（仅适用于井字棋）
 * @param board 棋盘数组
 * @returns string 获胜结果
 */
const checkWinner = (board: Array<Array<string>>) => {
    const winningCombinations = [
        // 横向获胜组合
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // 纵向获胜组合
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // 对角线获胜组合
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],
    ];

    for (const combination of winningCombinations) {
        const [aa, bb, cc] = combination;
        const playerA = board[aa[0]][aa[1]];
        const playerB = board[bb[0]][bb[1]];
        const playerC = board[cc[0]][cc[1]];

        if (playerA && playerA === playerB && playerA === playerC) {
            // 返回获胜的玩家
            return playerA;
        }
    }
    // 没有获胜者
    return EMPTY_CELL;
};

/**
 * 估值函数
 * @param board 棋盘数组
 * @returns 当前局面的得分
 */
const evaluateBoard = (board: Array<Array<string>>): number => {
    const { counts: countsCurrent, score: scoreCurrent } = countsPlayer(board, PLAYER_CURRENT);
    const { counts: countsOpponent, score: scoreOpponent } = countsPlayer(board, PLAYER_OPPONENT);

    const countsCurrentArr: Array<string> =
        `${countsCurrent.horizontal.join('')}${countsCurrent.vertical.join('')}${countsCurrent.diagonal.join('')}`.split('');
    const countsOpponentArr: Array<string> =
        `${countsOpponent.horizontal.join('')}${countsOpponent.vertical.join('')}${countsOpponent.diagonal.join('')}`.split('');

    // 将己方棋子统计减去对方棋子统计，得到最终棋盘上连子统计
    const countsSubArr = countsCurrentArr.map((count, index) => {
        return Number(count) - Number(countsOpponentArr[index]);
    });

    const score = scoreCurrent + nextPlayerIsWin(countsSubArr);
    return score - scoreOpponent;
};

/**
 * 为当前玩家进行局面评估（仅适用于井字棋）
 * @param board 棋盘数组
 * @param player 玩家类型
 * @returns 当前玩家局面分数
 */
const countsPlayer = (board: Array<Array<string>>, player: string): boardCountInfo => {
    const counts = JSON.parse(JSON.stringify(BOARD_COUNT));
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            // 统计当前 player玩家在各行，各列，各对角线，对角以及中心上棋子总数
            if (board[row][col] === player) {
                counts.horizontal[row]++;
                counts.vertical[col]++;
                if (row === col) counts.diagonal[0]++;
                if (row + col === 2) counts.diagonal[1]++;
                if ((row === 0 || row === 2) && (col === 0 || col === 2)) counts.cornerControl++;
                if (row === 1 && col === 1) counts.centerControl++;
            }
        }
    }
    let score = 0; // 计算分数
    // 连线个数得分
    score += counts.horizontal.reduce((acc: number, count: number) => acc + Math.pow(10, count), 0);
    score += counts.vertical.reduce((acc: number, count: number) => acc + Math.pow(10, count), 0);
    score += counts.diagonal.reduce((acc: number, count: number) => acc + Math.pow(10, count), 0);
    score += 5 * counts.cornerControl; // 角落位置控制得分
    score += 10 * counts.centerControl; // 中心位置控制得分
    return { counts, score };
};

/**
 * 判断最大递归数结束时，下一步落子的是己方还是对方；
 *  如是己方且下步就能赢则增加局面分数
 *  如是对方且下步就能赢则减少局面分数
 * @param countsSubArr 己方连子数减去对方连子数形成的数组
 * @returns 增加的局面分数
 */
const nextPlayerIsWin = (countsSubArr: Array<number>): number => {
    if (DEPTH % 2 === 0 && (countsSubArr.includes(2) || countsSubArr.includes(3))) return 50;
    if (DEPTH % 2 !== 0 && (countsSubArr.includes(-2) || countsSubArr.includes(-3))) return -50;
    return 0;
};

/**
 * 获取棋盘的空位
 * @param board 棋盘数组
 * @returns Array<{row: number, col: number}>
 */
const getAvailableBoards = (board: Array<Array<string>>): Array<{row: number, col: number}> => {
    const tempBoards: Array<{row: number, col: number}> = [];
    board.forEach((rowValue, row) => {
        rowValue.forEach((colValue, col) => {
            if (colValue === EMPTY_CELL) tempBoards.push({ row, col });
        });
    });
    return tempBoards;
};

/**
 * 将map类型转换为数组
 * @param boards 棋盘数据
 * @returns  Array<Array<string | null>>
 */
const convertToBoard = (boards: PiecesMapType): Array<Array<string>> => {
    const board = Array.from(Array(3), () => new Array(3).fill('-'));
    for (const values of boards) {
        const [row, col] = values[1].direction;
        board[row][col] = values[1].content;
    }
    return board;
};

export default useAIService;
