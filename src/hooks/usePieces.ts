/**
 * 数组转换
 * @param array 棋盘格数组
 * @param chunkSize 棋盘格分割为以chunkSize为单位的数组
 * @returns
 */
const chunkArray = (array: Array<string | null>, chunkSize: number) => {
    const result = [];
    for (let smallI = 0; smallI < array.length; smallI += chunkSize) {
        result.push(array.slice(smallI, smallI + chunkSize));
    }

    return result;
};
const chunkMapArray = (peicesMap: any, chunkSize: number) => {
    const result = [];
    Array.from({length: chunkSize*chunkSize}, (__, index) => {
        if(peicesMap.has(index)) {
            result.push(peicesMap.get(index).content);
        }else {
            result.push(null);
        }
    })
    return chunkArray(result, chunkSize)
}
/**
 * 判断各类N字棋是否胜出
 * @param {Array<string | null>} ary 棋盘格的数组
 * @param {number} pieces 棋盘格大小 n*n
 * @param {boolean} piecesTypeNum 棋盘获胜规则数量
 * @param currentXY 当前棋子的位置
 * @returns {string | null} 返回棋子值
 */
const usePieces = (ary: Array<string | null>, pieces: number, piecesTypeNum: number, currentXY: Array<number>) => {
    const newAry = chunkMapArray(ary, pieces);
    const [currentX, currentY] = currentXY;
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
        if (count >= piecesTypeNum) {
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
        if (xAxis >= 0 && xAxis < pieces && yAxis >= 0 && yAxis < pieces && newAry[xAxis][yAxis] === target) {
            return 1 + deepRecursion(xAxis + changeX, yAxis + changeY, changeX, changeY);
        }
        return 0;
    }
    return result;
};

export default usePieces;
