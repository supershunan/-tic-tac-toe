import React from 'react';
import Game from './components/Game';
import { gameSettings, AIGames } from '../game-setting';
import { GameSettings } from './type';
import '../App.less';
import { connect } from 'react-redux';

/**
 * @param games 游戏配置
 * @param currentGame 当前游戏配置
 * @param aiGames AI游戏选择
 * @param currentGameMode 当前游戏模式,默认为玩家先手
 */
interface ChooseGameState {
    games: Array<GameSettings>;
    currentGame: GameSettings;
    aiGames: Array<{key: number, value: string}>;
    currentGameMode: number;
}

interface ChooseGameProps {
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
interface GameStore {
    game: HistoryGameMap;
}

/**
 * redux 数据
 * @returns
 */
const mapStateToProps = (state: GameStore) => {
    return { gameStore: state.game };
};
class ChooseGame extends React.Component<ChooseGameProps, ChooseGameState> {
    constructor (props: ChooseGameProps) {
        super(props);
        this.state = {
            games: gameSettings,
            currentGame: gameSettings[0],
            aiGames: AIGames,
            currentGameMode: 0,
        };
    }

    /**
     * 选择游戏
     */
    handleChange (event: { target: {value: string}}) {
        const selectedValue = Number(event.target.value);
        this.setState({ currentGame: this.state.games[selectedValue] });
    }
    /**
     * 井字棋游戏模式改变
     */
    handleChangeMode (event: { target: { value: string}}) {
        const selectedValue = Number(event.target.value);
        this.setState({ currentGameMode: selectedValue });
    }

    render (): React.ReactNode {
        const { games, currentGame, aiGames, currentGameMode } = this.state;
        // 获取当前AI模式
        const gameStoreHistory = this.props.gameStore.historyGameMap[currentGame.type];
        const storeGameMode = gameStoreHistory?.aiType ?? null;
        return (
            <div>
                <label>
                    选择游戏：
                    <select onChange={this.handleChange.bind(this)}>
                        {
                            games.map((game, index) => {
                                return (
                                    <option key={index} value={index}>
                                        {game.name}
                                    </option>
                                );
                            })
                        }
                    </select>
                </label>
                <div>
                    {   currentGame.isAI
                        ? <label>
                            人机模式请选择先手：
                            <select onChange={this.handleChangeMode.bind(this)} defaultValue={storeGameMode === null ? 0 : storeGameMode}>
                                {
                                    aiGames.map((game, index) => {
                                        return (
                                            <option key={index} value={index}>
                                                {game.value}
                                            </option>
                                        );
                                    })
                                }
                            </select>
                        </label> : null
                    }
                </div>
                {
                    currentGame && <Game gameSetting={currentGame} gameMode={currentGameMode}/>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(ChooseGame);
