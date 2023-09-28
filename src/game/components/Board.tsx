import React from 'react';
import { BoardProp, PiecesMapType } from '../type/index';
import { connect } from 'react-redux';
import usePieces from '../../hooks/usePieces';
import Square from './Square';

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

interface BoardProps extends BoardProp {
    gameStore: HistoryGameMap;
}
interface BoardState {
    historySquares: PiecesMapType | null;
    currentPieceType: boolean | null;
    winner: string | null | undefined;
}

/**
 * redux 数据
 * @returns
 */
const mapStateToProps = (state: GameStore) => {
    return { gameStore: state.game };
};

class Board extends React.Component<BoardProps, BoardState> {
    constructor (props: BoardProps) {
        super(props);
        this.state = {
            historySquares: null,
            currentPieceType: true,
            winner: null,
        };
    }
    /**
     * props state 比较
     * @param prevProps
     */
    componentDidUpdate (prevProps: Readonly<BoardProps>): void {
        if (prevProps.jumpPlace !== this.props.jumpPlace) {
            this.jumpSquares(this.props.jumpPlace);
        }
        if (prevProps.gameSetting.type !== this.props.gameSetting.type) {
            this.judgeWinner();
        }
    }

    /**
     * 获取当前历史记录前的数据
     * @param jumpPlace 点击的历史记录位置
     */
    jumpSquares = (jumpPlace: number) => {
        const tempSquares = new Map(this.props.squares);
        let selectedItems = new Map();
        if (jumpPlace === -1) {
            selectedItems = tempSquares;
        } else {
            let count = 0;
            for (const [key, value] of tempSquares) {
                if (count < jumpPlace) {
                    selectedItems.set(key, value);
                    count++;
                } else {
                    break;
                }
            }
        }
        this.setState({ winner: null });
        // 判断当前的胜负
        const lastEntry = [...selectedItems.entries()].pop();
        if (lastEntry) {
            const win = usePieces(selectedItems, this.props.gameSetting.boardLength, this.props.gameSetting.victoryBaseReason, lastEntry[1].direction);
            if (win) {
                this.setState({ winner: win });
            }
        }
        this.setState({
            currentPieceType: selectedItems.size % 2 === 0,
            historySquares: selectedItems,
        });
    };
    /**
     * 切换游戏类型判断胜负
     */
    judgeWinner = () => {
        this.setState({
            winner: null,
            currentPieceType: true,
            historySquares: null,
        });
        if (this.props.gameStore.historyGameMap[this.props.gameSetting.type]) {
            const { historyGameMap } = this.props.gameStore.historyGameMap[this.props.gameSetting.type];
            const newSquares = new Map(historyGameMap);
            this.setState({ currentPieceType: newSquares.size % 2 === 0 });
            const lastEntry = [...newSquares.entries()].pop();
            if (lastEntry && this.props.gameSetting.chessType.find(el => el === lastEntry[1].content)) {
                const win = usePieces(newSquares, this.props.gameSetting.boardLength, this.props.gameSetting.victoryBaseReason, lastEntry[1].direction);
                if (win) {
                    this.setState({ winner: win });
                }
            }
        }
    };

    /**
     *
     * @param stingCoordinate 棋子坐标字符串
     * @param pieceCoordinate 棋子坐标
     * @returns
     */
    handleClick = (stingCoordinate: string, pieceCoordinate: Array<number>) => {
        const { gameSetting, squares } = this.props;
        const { historySquares, currentPieceType, winner } = this.state;
        const piecesData = {
            direction: pieceCoordinate,
            content: '',
            key: stingCoordinate,
        };
        const newSquares =  historySquares ? historySquares : squares;
        piecesData.content = currentPieceType ? gameSetting.chessType[0] : gameSetting.chessType[1];
        const isExist = historySquares ? historySquares?.get(stingCoordinate) : squares?.get(stingCoordinate);

        if (winner || isExist) {
            return;
        }
        newSquares.set(stingCoordinate, piecesData);

        // 使用封装好的棋盘hook
        const win = usePieces(newSquares, gameSetting.boardLength, gameSetting.victoryBaseReason, pieceCoordinate);
        if (win) {
            this.setState({ winner: win });
            this.props.addNewPieces(newSquares);
            return;
        }
        // 添加新数组
        this.props.addNewPieces(newSquares);
        this.setState({
            currentPieceType: newSquares.size % 2 === 0,
            historySquares: null,
        });
    };

    /**
     * 给整个棋盘添加点击事件，通过监听数据触发渲染
     * @param event dom事件
     */
    handleBoardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = event.target as HTMLButtonElement;
        const piecCoordinate = JSON.parse(target.getAttribute('data-direction') as string);
        const stingCoordinate = piecCoordinate !== null && piecCoordinate.join('');
        const isExecute = (Array.isArray(piecCoordinate) && piecCoordinate.length === 2);
        if (isExecute) {
            this.handleClick(stingCoordinate, piecCoordinate);
        }
    };

    render (): React.ReactNode {
        const { gameSetting, squares } = this.props;
        const { historySquares, currentPieceType, winner } = this.state;
        let status: string;

        if (winner) {
            status = `获胜者为: ${winner}`;
        } else {
            if (squares.size < gameSetting.boardLength * gameSetting.boardLength) {
                status = `本次下棋者为: ${(currentPieceType ? gameSetting.chessType[0] : gameSetting.chessType[1])}`;
            } else {
                status = '平局';
            }
        }

        const listSquars = Array.from({ length: gameSetting.boardLength }, (__, index) => (
            <div key={index} className="board-row">
                {Array.from({ length: gameSetting.boardLength }, (__, smallI) => {
                    // 坐标转为字符串作为唯一的key
                    const stingCoordinate = [index, smallI].join('');
                    return (
                        <Square
                            key={stingCoordinate}
                            content={historySquares ? historySquares?.get(stingCoordinate)?.content : squares?.get(stingCoordinate)?.content}
                            direction={JSON.stringify([index, smallI])}
                        />
                    );
                })}
            </div>
        ));

        return (
            <div>
                <div className="user">{status}</div>
                <div onClick={this.handleBoardClick}>
                    {listSquars}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(Board);
