import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveGameHistory } from '../../store/game/gameSlice';
import Board from './Board';
import '../../App.less';
import { GameProps, GameStore, PiecesMapType } from '../type/index';

/**
 * 游戏主体
 * @returns
 */
const Game: React.FC<GameProps> = ({ gameSetting }) => {
    const gameStore = useSelector((state: GameStore) => state.game);
    const [gameType, setGameType] = useState(gameSetting.type);
    const [piecesMap, setPiecesMap] = useState<PiecesMapType>(new Map());
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
            piecesMap.size > 0 && setPiecesMap(new Map());
            currentMove !== 0 && setCurrentMove(0);
            jumpPlace !== -1 && setJumpPlace(-1);
        }
    };
    /**
     * 处理当前棋盘
     * @param nextSquares 更新后的棋盘数据
     */
    const handlePlay = (nextSquares: PiecesMapType) => {
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
