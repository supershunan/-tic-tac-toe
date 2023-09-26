import { useState } from 'react';
import Game from './components/Game';
import { gameSettings } from '../game-setting';

/**
 * 游戏配置
 * @param name 游戏名字
 * @param name 游戏类型
 * @param boardLength 棋盘宽度
 * @param victoryBaseReason 游戏胜利的基础条件
 * @param chessType 棋子类型
 */
interface GameSettings {
    name: string;
    type: string;
    boardLength: number;
    victoryBaseReason: number;
    chessType: Array<string>;
}
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
            {
                currentGame && <Game gameSetting={currentGame}/>
            }
        </div>
    );
};

export default ChooseGame;
