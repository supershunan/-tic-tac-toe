import { BoardProp, PiecesMapType } from '../type/index';

type HistoryState = {
    currentGameMove: number;
    historyGameMap: Array<[string, { direction: Array<number>, content: string, key: string }]>;
    jumpPlace: number;
    gameType: string;
}

interface HistoryGameMap {
    historyGameMap: {
        [key: string]: HistoryState;
    };
}
export interface GameStore {
    game: HistoryGameMap;
}

export interface BoardProps extends BoardProp {
    gameStore: HistoryGameMap;
    gameMode: number;
}
export interface BoardState {
    historySquares: PiecesMapType | null;
    currentPieceType: boolean | null;
    winner: string | null | undefined;
}