import { GameSettings } from './index';

/**
 * @param games 游戏配置
 * @param currentGame 当前游戏配置
 * @param aiGames AI游戏选择
 * @param currentGameMode 当前游戏模式,默认为玩家先手
 */
export interface ChooseGameState {
    games: Array<GameSettings>;
    currentGame: GameSettings;
    aiGames: Array<{key: number, value: string}>;
    currentGameMode: number;
}

export interface ChooseGameProps {
    gameStore: HistoryGameMap;
}

type HistoryState = {
    currentGameMove: number;
    historyGameMap: Array<[string, { direction: Array<number>, content: string, key: string }]>;
    jumpPlace: number;
    gameType: string;
    aiType?: number;
}

interface HistoryGameMap {
    historyGameMap: {
        [key: string]: HistoryState;
    };
}
export interface GameStore {
    game: HistoryGameMap;
}
