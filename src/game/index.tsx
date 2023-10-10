import React from 'react';
import Game from './components/Game';
import { gameSettings } from '../game-setting';
import { GameSettings } from './type';
import '../App.less';

/**
 * @param games 游戏配置
 * @param currentGame 当前游戏配置
 * @param aiGames AI游戏选择
 * @param currentGameMode 当前游戏模式
 */
interface ChooseGameState {
    games: Array<GameSettings>;
    currentGame: GameSettings;
    aiGames: Array<{key: number, value: string}>;
    currentGameMode: number;
}

export default class ChooseGame extends React.Component<{}, ChooseGameState> {
    constructor (props: {}) {
        super(props);
        this.state = {
            games: gameSettings,
            currentGame: gameSettings[0],
            aiGames: [
                {
                    key: 0,
                    value: '人类先手',
                },
                {
                    key: 1,
                    value: 'AI先手',
                },
            ],
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
                            <select onChange={this.handleChangeMode.bind(this)}>
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
