import { createSlice } from '@reduxjs/toolkit';

/**
 * @param key 游戏唯一标识
 * @param currentGameMove 游戏当前位置
 * @param historyGameMap 棋盘数据
 * @param jumpPlace 历史位置
 * @param gameType 游戏类型
 */
interface HistoryGameMap {
    currentGameMove?: number;
    historyGameMap?: Array<Array<number | { direction: Array<number>, content: string, key: number }>>;
    jumpPlace?: number;
    gameType?: string;
}
interface SliceProps {
    historyGameMap: HistoryGameMap;
}

const initialState: SliceProps = { historyGameMap: {} };

const gameSice = createSlice({
    name: 'gameSice',
    initialState,
    reducers: {
        saveGameHistory: (state, action: {payload: HistoryGameMap}) => {
            const pieceKey = action.payload.gameType;
            if (pieceKey !== undefined) {
                (state.historyGameMap as { [key: string]: HistoryGameMap })[pieceKey] = action.payload;
            }
        },
    },
});

export const { saveGameHistory } = gameSice.actions;

export default gameSice.reducer;
