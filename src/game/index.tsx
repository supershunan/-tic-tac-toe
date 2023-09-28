import React from 'react';
import Game from './components/Game';
import { gameSettings } from '../game-setting';
import { GameSettings } from './type';
import '../App.less';

interface ChooseGameState {
    games: Array<GameSettings>;
    currentGame: GameSettings;
}

export default class ChooseGame extends React.Component<{}, ChooseGameState> {
    constructor (props: {}) {
        super(props);
        this.state = {
            games: gameSettings,
            currentGame: gameSettings[0],
        };
    }

    /**
     * 选择游戏
     */
    handleChange (event: { target: {value: string}}) {
        const selectedValue = Number(event.target.value);
        this.setState({ currentGame: this.state.games[selectedValue] });
    }

    render (): React.ReactNode {
        const { games, currentGame } = this.state;
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
                {
                    currentGame && <Game gameSetting={currentGame}/>
                }
            </div>
        );
    }
}
