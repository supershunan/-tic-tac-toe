import { createSlice } from '@reduxjs/toolkit';


interface SliceProps {
    historyTicMap: Array<Array<number | { direction: Array<number>, content: string, key: number }>>;
    historyGoBangMap: Array<Array<number | { direction: Array<number>, content: string, key: number }>>;
    currentTicMove: number;
    currentGoBangMove: number;
    pieceType: boolean;
    currentsTicXY: Array<string>;
    currentsGoBangXY: Array<string>;
    sliceCurentsTicXY: Array<string>;
    sliceCurentsGoBangXY: Array<string>;
}

const initialState: SliceProps = {
    historyTicMap: [],
    historyGoBangMap: [],
    currentTicMove: 0,
    currentGoBangMove: 0,
    pieceType: true,
    currentsTicXY: [],
    currentsGoBangXY: [],
    sliceCurentsTicXY: [],
    sliceCurentsGoBangXY: [],
};

const ticTacORgoBangSice = createSlice({
    name: 'ticTacORgoBang',
    initialState,
    reducers: {
        // redux 里的 state 是根据之前的数据进行判断的，不会用最新的值
        saveHistory: (state, action) => {
            if (state.pieceType) {
                state.historyTicMap = action.payload;
            } else {
                state.historyGoBangMap = action.payload;
            }
        },
        setPieceType: (state, action) => {
            state.pieceType = action.payload;
        },
        setCurentMove: (state, action) => {
            if (state.pieceType) {
                state.currentTicMove = action.payload;
            } else {
                state.currentGoBangMove = action.payload;
            }
        },
        setCurrentsXY: (state, action) => {
            if (state.pieceType) {
                state.currentsTicXY = action.payload;
            } else {
                state.currentsGoBangXY = action.payload;
            }
        },
        setSliceCurrentsXY: (state, action) => {
            if (state.pieceType) {
                state.sliceCurentsTicXY = action.payload;
            } else {
                state.sliceCurentsGoBangXY = action.payload;
            }
        },
    },
});

export const { saveHistory, setPieceType, setCurentMove, setCurrentsXY, setSliceCurrentsXY } = ticTacORgoBangSice.actions;

export default ticTacORgoBangSice.reducer;
