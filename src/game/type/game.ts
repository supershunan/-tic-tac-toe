import { GameSettings, PiecesMapType } from '../type/index';


export type HistoryState = {
    currentGameMove: number;
    historyGameMap: Array<[string, { direction: Array<number>, content: string, key: string }]>;
    jumpPlace: number;
    gameType: string;
    aiType?: number;
}

export interface HistoryGameMap {
    historyGameMap: {
        [key: string]: HistoryState;
    };
}
export interface GameStore {
    game: HistoryGameMap;
}

export interface GameProps {
    gameStore: HistoryGameMap;
    gameSetting: GameSettings;
    gameMode: number;
    saveGameHistory: (data: HistoryState) => void;
}

export interface GameState {
    piecesMap: PiecesMapType;
    currentMove: number;
    jumpPlace: number;
}