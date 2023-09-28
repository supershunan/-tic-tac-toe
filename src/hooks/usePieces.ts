import { PiecesMapType } from '../game/type/index';
/**
 * 数组转换
 * @param array 棋盘格数组
 * @param boardLength 棋盘格分割为以boardLength为单位的数组
 * @returns 二维数组
 */
const chunkArray = (array: Array<string | null>, boardLength: number) => {
    const result = [];
    for (let smallI = 0; smallI < array.length; smallI += boardLength) {
        result.push(array.slice(smallI, smallI + boardLength));
    }

    return result;
};
/**
 * 生成当前棋盘所以内容
 * @param peicesMap 棋盘map数据
 * @param boardLength 棋盘类型n*n
 * @returns
 */
const chunkMapArray = (peicesMap: PiecesMapType, boardLength: number): Array<Array<string | null>> => {
    const result: Array<string | null> = [];

    Array.from({ length: boardLength * boardLength }, (__, xx) => {
        Array.from({ length: boardLength }, (__, yy) => {
            const axis = [xx, yy].join('');
            const piecesValue = peicesMap.get(axis);
            if (peicesMap.has(axis) && piecesValue !== undefined) {
                result.push(piecesValue.content);
            } else {
                result.push(null);
            }
        });
    });
    return chunkArray(result, boardLength);
};
/**
 * 判断各类N字棋是否胜出
 * @param {PiecesMapType} map 棋盘格的数组
 * @param {number} boardLength 棋盘大小 n*n
 * @param {boolean} victoryBaseReason 棋盘获胜规则
 * @param currentCoordinate 当前棋子的位置
 * @returns {string | undefined} 返回棋子内容
 */
const usePieces = (map: PiecesMapType, boardLength: number, victoryBaseReason: number, currentCoordinate: Array<number>): string | null | undefined => {
    const newAry = chunkMapArray(map, boardLength);
    const [currentX, currentY] = currentCoordinate;
    const target = newAry[currentX][currentY];
    let result;
    // 移动方向
    const directions = [
        [1, 0],
        [0, 1],
        [1, 1],
        [-1, 1],
    ];

    for (const [xx, yy] of directions) {
        const count = 1 + deepRecursion(currentX + xx, currentY + yy, xx, yy) + deepRecursion(currentX - xx, currentY - yy, -xx, -yy);
        if (count >= victoryBaseReason) {
            result = target;
            break;
        }
    }

    /**
     * 深度递归
     * @param xAxis x轴
     * @param yAxis y轴
     * @param changeX 变化量
     * @param changeY 变化量
     * @return
     */
    function deepRecursion (xAxis: number, yAxis: number, changeX: number, changeY: number): number {
        if (xAxis >= 0 && xAxis < boardLength && yAxis >= 0 && yAxis < boardLength && newAry[xAxis][yAxis] === target) {
            return 1 + deepRecursion(xAxis + changeX, yAxis + changeY, changeX, changeY);
        }
        return 0;
    }
    return result;
};

export default usePieces;
