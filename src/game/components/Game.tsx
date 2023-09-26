import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveGameHistory } from '../../store/game/gameSlice';
import Board from './Board';
import '../../App.less';

/**
 * 存储棋盘的类型
 */
type PiecesMap = Map<number, { direction: Array<number>, content: string, key: number }>
/**
 * 游戏配置
 * @param name 游戏名字
 * @param board 棋盘宽度
 * @param victoryBaseReason 游戏胜利的基础条件
 * @param chessType 棋子类型
 */
type GameSetting = {
    name: string;
    type: string;
    boardLength: number;
    victoryBaseReason: number;
    chessType: Array<string>;
}
/**
 * @param gameSetting 游戏配置
 */
interface GameProps {
    gameSetting: GameSetting;
}
/**
 * @param key 游戏唯一标识
 * @param currentGameMove 游戏当前位置
 * @param historyGameMap 棋盘数据
 * @param jumpPlace 历史位置
 * @param gameType 游戏类型
 */
type Game = {
    historyGameMap: {
        [key: string]: {
            currentGameMove: number;
            historyGameMap: PiecesMap;
            jumpPlace: number;
            gameType: string;
        };
    };
}
/**
 * redux 存储游戏
 */
interface GameStore {
    game: Game;
}

/**
 * 游戏主体
 * @returns
 */
const Game: React.FC<GameProps> = ({ gameSetting }) => {
    const gameStore = useSelector((state: GameStore) => state.game);
    const [gameType, setGameType] = useState(gameSetting.type);
    const [piecesMap, setPiecesMap] = useState<PiecesMap>(new Map());
    const [currentMove, setCurrentMove] = useState<number>(0);
    const [jumpPlace, setJumpPlace] = useState<number>(-1);
    const dispatch = useDispatch();

    /**
     * 重新初始化
     */
    const initGame = () => {
        if (gameStore.historyGameMap[gameSetting.type]) {
            const { historyGameMap, currentGameMove, jumpPlace } = gameStore.historyGameMap[gameSetting.type];
            setPiecesMap(new Map(historyGameMap));
            setCurrentMove(currentGameMove);
            setJumpPlace(jumpPlace);
        } else {
            setPiecesMap(new Map());
            setCurrentMove(0);
            setJumpPlace(-1);
        }
    };
    /**
     * 处理当前棋盘
     * @param nextSquares 更新后的棋盘数据
     */
    const handlePlay = (nextSquares: PiecesMap) => {
        const newCurrentXY: Array<string> = [];
        nextSquares.forEach((value) => {
            const currentStr = value.direction;
            newCurrentXY.push(currentStr.join(''));
        });

        setPiecesMap(new Map(nextSquares));
        setCurrentMove(nextSquares.size);
    };
    /**
     * 历史点击
     * @param nextMove 步骤
     */
    const jumpTo = (nextMove: number) => {
        setJumpPlace(nextMove);
    };

    // 历史步骤
    const moves = Array(currentMove + 1).fill(null)
        .map((squares: Array<string | null>, move: number) => {
            let description;
            if (move > 0) {
                description = `Go to move # ${move}`;
            } else {
                description = 'Go to game start';
            }
            return (
                <li key={move}>
                    <button onClick={() => jumpTo(move)}>{description}</button>
                </li>
            );
        });

    useEffect(() => {
        setGameType(gameSetting.type);
        // redux 存储数据
        dispatch(saveGameHistory({
            historyGameMap: Array.from(piecesMap),
            currentGameMove: currentMove,
            gameType,
            jumpPlace,
        }));
        // 初始化
        initGame();
    }, [gameSetting]);

    return (
        <div className="game">
            <div className="game-content">
                <div className="game-board">
                    <Board gameSetting={gameSetting} squares={piecesMap} jumpPlace={jumpPlace} addNewPieces={handlePlay} />
                </div>
                <div className="game-info">
                    <ol>{moves}</ol>
                </div>
            </div>
        </div>
    );
};

export default Game;
