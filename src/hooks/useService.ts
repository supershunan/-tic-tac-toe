// 此 hooks 暂只支持井字棋
import { PiecesMapType } from '../game/type/index';

/**
 * AI 入口
 * @param boards 棋盘数据
 * @param player 当前棋子
 * @param isPlayerFirst 是否先手 true 先手 false 后手
 * @param depth 递归深度
 * @param alpha α 当前节点的权重
 * @param beta  β 对方节点的权重
 * @returns object {row: number, col: number}
 */
const useAIService = (boards: PiecesMapType, player: string, isPlayerFirst: boolean, depth = 0, alpha = -Infinity, beta = Infinity): {row: number, col: number} => {
    const bestMove = { row: -1, col: -1 };
    let bestScore = isPlayerFirst ? -Infinity : Infinity;

    const board = convertToBoard(boards);

    if (isEmptyBoard(board) || isCenterPlace(board, isPlayerFirst)) {
        if (isPlayerFirst) {
            // 如果AI先手，尽可能赢
            bestMove.row = 1;
            bestMove.col = 1;
        } else {
            // 如果AI后手，放在中心
            if (board[1][1] === null) {
                bestMove.row = 1;
                bestMove.col = 1;
            } else {
                // 如果中心已经被占据，放在左上角
                bestMove.row = 0;
                bestMove.col = 0;
            }
        }
        return bestMove;
    }
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === null) {
                board[row][col] = player;
                const score = minimax(board, depth + 1, !isPlayerFirst, alpha, beta);
                board[row][col] = null;

                if (isPlayerFirst) {
                    // console.log(score + ' | ' + row + ',' + col + '  | ' +  bestScore);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove.row = row;
                        bestMove.col = col;
                    }
                    alpha = Math.max(alpha, score);
                } else {
                    // console.log(score + ' | ' + row + ',' + col + '  | ' +  bestScore);
                    if (score < bestScore) {
                        bestScore = score;
                        bestMove.row = row;
                        bestMove.col = col;
                    }
                    beta = Math.min(beta, score);
                }

                if (alpha >= beta) {
                    break; // 剪枝
                }
            }
        }
    }
    // console.log(bestMove);
    return bestMove;
};

/**
 * 递归的剪枝算法
 * @param board 棋盘数组
 * @param depth 递归深度约
 * @param isMaximizingPlayer 下棋者
 * @param alpha α 当前节点的权重
 * @param beta  β 对方节点的权重
 * @returns number
 */
function minimax (board: Array<Array<string | null>>, depth: number, isMaximizingPlayer: boolean, alpha: number, beta: number): number {
    const result = evaluate(board, 'X');
    let bestScore;
    if (result !== 0 || depth >= 2) {
        return result;
    }

    if (isMaximizingPlayer) {
        bestScore = -Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === null) {
                    board[row][col] = 'X';
                    const score = minimax(board, depth + 1, false, alpha, beta);
                    board[row][col] = null;
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, score);
                    // 剪枝
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
        // return bestScore;
    } else {
        bestScore = Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === null) {
                    board[row][col] = 'O';
                    const score = minimax(board, depth + 1, true, alpha, beta);
                    board[row][col] = null;
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, score);
                    // 剪枝
                    if (alpha >= beta) {
                        break;
                    }
                }
            }
        }
        // return bestScore;
    }
    return bestScore;
}
/**
   * 评估算法
   */
function evaluate (board: Array<Array<string | null>>, player: string) {
    const opponent = player === 'X' ? 'O' : 'X';

    // 判断是否当前玩家胜利
    if (isWinner(board, player)) {
        return 15;
    }

    // 判断是否对手玩家胜利
    if (isWinner(board, opponent)) {
        return -15;
    }

    // 当前玩家
    const playerLines = countPossibleLines(board, player);

    // 对手玩家
    const opponentLines = countPossibleLines(board, opponent);
    // console.log(playerLines + '  | ' +  opponentLines);
    // 特殊棋局需要将权重改变(仅适用于井字棋)
    if (playerLines < opponentLines && playerLines === 0) {
        return -11;
    }
    if (playerLines > opponentLines && opponentLines === 0) {
        return 11;
    }

    // 评估连线数
    const score = playerLines - opponentLines;

    return score;
}

/**
 * 检测获胜
 * @param board 棋盘数据
 * @param player 下棋者
 * @returns boolean
 */
function isWinner (board: Array<Array<string | null>>, player: string): boolean {
    // 检查每一行
    for (let row = 0; row < 3; row++) {
        if (board[row][0] === player && board[row][1] === player && board[row][2] === player) {
            return true;
        }
    }

    // 检查每一列
    for (let col = 0; col < 3; col++) {
        if (board[0][col] === player && board[1][col] === player && board[2][col] === player) {
            return true;
        }
    }

    // 检查对角线
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
        return true;
    }

    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
        return true;
    }

    // 如果没有满足胜利条件的情况，返回 false
    return false;
}

/**
 * 判断各个方向的连线
 * @param board 棋盘数据
 * @param player 下棋者
 * @returns number
 */
function countPossibleLines (board: Array<Array<string | null>>, player: string): number {
    // 计算当前玩家在各个方向上的可能连线数
    let lines = 0;

    // 检查每一行
    for (let row = 0; row < 3; row++) {
        if (board[row][0] === player && board[row][1] === player && board[row][2] === null) {
            lines++;
        }
        if (board[row][0] === player && board[row][2] === player && board[row][1] === null) {
            lines++;
        }
        if (board[row][1] === player && board[row][2] === player && board[row][0] === null) {
            lines++;
        }
    }

    // 检查每一列
    for (let col = 0; col < 3; col++) {
        if (board[0][col] === player && board[1][col] === player && board[2][col] === null) {
            lines++;
        }
        if (board[0][col] === player && board[2][col] === player && board[1][col] === null) {
            lines++;
        }
        if (board[1][col] === player && board[2][col] === player && board[0][col] === null) {
            lines++;
        }
    }

    // 检查对角线
    if (board[0][0] === player && board[1][1] === player && board[2][2] === null) {
        lines++;
    }
    if (board[0][0] === player && board[2][2] === player && board[1][1] === null) {
        lines++;
    }
    if (board[1][1] === player && board[2][2] === player && board[0][0] === null) {
        lines++;
    }
    if (board[0][2] === player && board[1][1] === player && board[2][0] === null) {
        lines++;
    }
    if (board[0][2] === player && board[2][0] === player && board[1][1] === null) {
        lines++;
    }
    if (board[1][1] === player && board[2][0] === player && board[0][2] === null) {
        lines++;
    }

    return lines;
}


/**
 * 将map类型转换为数组
 * @param boards 棋盘数据
 * @returns  Array<Array<string | null>>
 */
function convertToBoard (boards: PiecesMapType): Array<Array<string | null>> {
    const board = Array.from(Array(3), () => new Array(3).fill(null));
    for (const values of boards) {
        const [row, col] = values[1].direction;
        board[row][col] = values[1].content;
    }
    return board;
}

/**
 * 检查棋盘是否为空
 * @param board 棋盘数组
 * @returns boolean
 */
function isEmptyBoard (board: Array<Array<string | null>>): boolean {
    return board.every(row => row.every((cell: string | null) => cell === null));
}

/**
 * 为 AI 增加获胜几率，判断中间位置是否放了棋子
 * @param board 棋盘数据
 * @param isPlayerFirst 先后手
 * @returns boolean
 */
function isCenterPlace (board: Array<Array<string | null>>, isPlayerFirst: boolean): boolean {
    if (!isPlayerFirst) {
        const isCenter = board[1][1] === null;
        return isCenter;
    }
    return false;
}

export default useAIService;
