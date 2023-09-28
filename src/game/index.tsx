import { useState } from 'react';
import Game from './components/Game';
import { gameSettings } from '../game-setting';
import { GameSettings } from './type/index.ts';

/**
 * 选择棋盘类型
 * @returns
 */
const ChooseGame: React.FC<{}> = () => {
    const [games] = useState<Array<GameSettings>>(gameSettings);
    const [currentGame, setCurrentGame] = useState<GameSettings>(gameSettings[0]);
    /**
     * 选择游戏
     */
    const handleChange = (event: { target: {value: string}}) => {
        const selectedValue = Number(event.target.value);
        setCurrentGame(games[selectedValue]);
    };
    /**
     * 添加游戏
     */
    // const handleChildDataChange = (child: any) => {
    //     setGames(() => {
    //         return [...child]
    //     });
    // };

    return (
        <div>
            <label>
                选择游戏：
                <select onChange={handleChange}>
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
            {/* <AddGame addGameGetting={handleChildDataChange} /> */}
            {
                currentGame && <Game gameSetting={currentGame}/>
            }
        </div>
    );
};

export default ChooseGame;
