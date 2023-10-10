import React from 'react';
import { GameSettings, PiecesMapType } from '../type/index';
import { connect } from 'react-redux';
import { saveGameHistory } from '../../store/game/gameSlice';
import Board from './Board';

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
interface GameStore {
    game: HistoryGameMap;
}

interface GameProps {
    gameStore: HistoryGameMap;
    gameSetting: GameSettings;
    gameMode: number;
    saveGameHistory: (data: HistoryState) => void;
}

interface GameState {
    piecesMap: PiecesMapType;
    currentMove: number;
    jumpPlace: number;
}

/**
 * redux 数据
 * @returns
 */
const mapStateToProps = (state: GameStore) => {
    return { gameStore: state.game };
};
/**
 * redux 方法
*/
const mapDispatchToProps = (dispatch: any) => {
    return { saveGameHistory: (data: HistoryState) => dispatch(saveGameHistory(data)) };
};

/**
 * 游戏主体
 */
class Game extends React.Component<GameProps, GameState> {
    constructor (props: GameProps) {
        super(props);
        this.state = {
            piecesMap: new Map(),
            currentMove: 0,
            jumpPlace: -1,
        };
    }

    /**
     * 监听 props 和 state 的变化
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate (prevProps: Readonly<GameProps>, prevState: Readonly<GameState>): void {
        if (prevProps.gameSetting.type !== this.props.gameSetting.type) {
            this.props.saveGameHistory({
                historyGameMap: Array.from(prevState.piecesMap),
                currentGameMove: prevState.currentMove,
                gameType: prevProps.gameSetting.type,
                jumpPlace: prevState.jumpPlace,
            });
            this.initGame();
        }

        if (prevProps.gameMode !== this.props.gameMode) {
            this.setState({
                piecesMap: new Map(),
                currentMove: 0,
                jumpPlace: -1,
            });
        }
    }

    /**
     * 重新初始化
     */
    initGame = () => {
        const gameStoreHistory = this.props.gameStore.historyGameMap[this.props.gameSetting.type];
        if (gameStoreHistory) {
            const { historyGameMap, currentGameMove, jumpPlace } = gameStoreHistory;
            this.setState({
                piecesMap: new Map(historyGameMap),
                currentMove: currentGameMove,
                jumpPlace,
            });
        } else {
            this.setState({
                piecesMap: new Map(),
                currentMove: 0,
                jumpPlace: -1,
            });
        }
    }

    /**
     * 处理当前棋盘
     * @param nextSquares 更新后的棋盘数据
     */
    handlePlay = (nextSquares: PiecesMapType) => {
        this.setState({
            piecesMap: new Map(nextSquares),
            jumpPlace: -1,
            currentMove: nextSquares.size,
        });
    };

    /**
     * 历史点击
     * @param nextMove 步骤
     */
    jumpTo = (nextMove: number) => {
        this.setState({ jumpPlace: nextMove });
    };


    render (): React.ReactNode {
        const { piecesMap, currentMove, jumpPlace } = this.state;
        const { gameMode } = this.props;
        // 历史步骤
        const moves = Array(currentMove + 1).fill(null)
            .map((squares: Array<string | null>, move: number) => {
                let description;
                let isDisabled;
                if (move % 2 === 0) {
                    isDisabled = Boolean(gameMode);
                } else {
                    isDisabled = Boolean(!gameMode);
                }
                if (move > 0) {
                    description = `Go to move # ${move}`;
                } else {
                    description = 'Go to game start';
                }
                return (
                    <li key={move}>
                        <button disabled={ this.props.gameSetting.isAI ? isDisabled : false } onClick={() => this.jumpTo(move)}>{description}</button>
                    </li>
                );
            });

        return (
            <div className="game">
                <div className="game-content">
                    <div className="game-board">
                        <Board gameSetting={this.props.gameSetting} squares={piecesMap} jumpPlace={jumpPlace} addNewPieces={this.handlePlay} gameMode={this.props.gameMode}/>
                    </div>
                    <div className="game-info">
                        <ol>{moves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
