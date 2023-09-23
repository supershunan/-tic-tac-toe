import React from 'react';
import './App.less';
import usePieces from './hooks/usePieces';
import { connect } from 'react-redux';
import { saveHistory, setPieceType, setCurentMove, setCurrentsXY, setSliceCurrentsXY } from './store/ticTac/ticTacSlice';

interface ChooseGameStateType {
    pieces: number;
    pieceType: boolean;
}
interface SliceProps {
    historyTicMap: Array<any>;
    historyGoBangMap: Array<any>;
    currentTicMove: number;
    currentGoBangMove: number;
    pieceType: boolean;
    currentsTicXY: Array<string | null>;
    currentsGoBangXY: Array<string | null>;
    sliceCurentsTicXY: Array<string>;
    sliceCurentsGoBangXY: Array<string>;
}
interface GamePropsType extends ChooseGameStateType {
    ticTacORgoBang: SliceProps;
    saveHistory: (data: Array<any>) => void;
    setPieceType: (data: boolean) => void;
    setCurentMove: (data: number) => void;
    setCurrentsXY: (data: Array<string | null>) => void;
    setSliceCurrentsXY: (data: Array<string | null>) => void;
}

interface GameStateType extends ChooseGameStateType {
    currentMove: number;
    historyMap: Map<number, Array<string | null>>;
    currentsXY: Array<string | null>;
    sliceCurentsXY: Array<string | null>;
    resetWinner: boolean;
}

interface BoardStateType extends ChooseGameStateType {
    squares: Map<number, Array<string | null>>;
    xIsNext: boolean;
    resetWinner: boolean;
    onPlay: (value: Map<number, Array<string | null>>, currentXY: Array<number>) => void;
    sliceCurentsXY: Array<string | null>;
}

interface SquareStateType {
    pieceType: boolean;
    value: string | null;
    onSquareClick: () => void;
}


/**
 * 格子
 */
class Square extends React.Component<SquareStateType, {}> {
    constructor (props: SquareStateType) {
        super(props);
    }
    /**
     * 提高渲染性能
     * @param nextProps
     * @param nextState
     * @param nextContext
     * @returns
     */
    shouldComponentUpdate (nextProps: Readonly<SquareStateType>): boolean {
        if (nextProps.value === this.props.value && nextProps.pieceType === this.props.pieceType && nextProps.onSquareClick === this.props.onSquareClick) {
            return false;
        } else {
            return true;
        }
    }
    render (): React.ReactNode {
        const { value, pieceType, onSquareClick } = this.props;
        return (
            pieceType
                ? <button className="square" onClick={onSquareClick}>
                    {value}
                </button>
                : <button className="square-gobang" onClick={onSquareClick}>
                    <div className="diagonal-line diagonal-line1"></div>
                    <div className="diagonal-line diagonal-line2"></div>
                    <p className="text">{value}</p>
                </button>
        );
    }
}

/**
 * 棋盘
 */
class Board extends React.Component<BoardStateType, {winner: string | null | undefined}> {
    constructor (props: BoardStateType) {
        super(props);
        this.state = {
            winner: null,
        };
    }
    /**
     *
     * @param prevProps
     */
    componentDidUpdate (prevProps: Readonly<BoardStateType>): void {
        if (this.props.resetWinner !== prevProps.resetWinner) {
            this.setState({
                winner: null,
            });
        }
    }

    /**
     *
     * @param value 点击的第几个
     * @returns
     */
    handleClick = (value: number, currentXY: Array<number>) => {
        const { pieces, pieceType, xIsNext, squares, onPlay } = this.props;
        if (this.state.winner || squares.get(value)) {
            return;
        }

        const piecesData: {direction: Array<number>, content: string | null, key: number} = {
            direction: currentXY,
            content: '',
            key: value
        };
        const newMap = new Map(squares);
        const piecesTypeNum = pieceType ? 3 : 5;
        if (pieceType) {
            xIsNext ? piecesData.content = 'X' : piecesData.content = 'O';
        } else {
            xIsNext ? piecesData.content = '⚫' : piecesData.content = '⚪';
        }
        newMap.set(value, piecesData)

        // 使用封装好的棋盘hook
        const win = usePieces(newMap, pieces, piecesTypeNum, currentXY);
        if (win) {
         this.setState({
                winner: win,
            });
            onPlay(newMap, currentXY);
            return;
        }
        // 添加新数组
        onPlay(newMap, currentXY);
    };

    render (): React.ReactNode {
        const { pieces, pieceType, squares, xIsNext, sliceCurentsXY } = this.props;

        let status: string;
        if (this.state.winner) {
            status = `获胜者为: ${this.state.winner}`;
        } else {
            if (pieceType) {
                status = `本次下棋者为: ${(xIsNext ? 'X' : 'O')}`;
            } else {
                status = `本次下棋者为: ${(xIsNext ? '⚫' : '⚪')}`;
            }
        }

        const listSquars = Array.from({ length: pieces }, (__, index) => (
            <div key={index} className="board-row">
                {Array.from({ length: pieces }, (__, smallI) => {
                    // 为每个格子传递为数组对应的index,此处计算为固定算法，可考虑不追其原因
                    const num = index + ((index + 1) * (pieces - 1)) - (pieces - 1 - smallI);
                    return (
                        <Square
                            key={num}
                            value={sliceCurentsXY.includes([index, smallI].join('')) ? null : squares.get(num)?.content}
                            pieceType={pieceType}
                            onSquareClick={() => this.handleClick(num, [index, smallI])}
                        />
                    );
                })}
            </div>
        ));

        return (
            <div>
                <div className="user">{status}</div>
                {listSquars}
            </div>
        );
    }
}

/**
 * 游戏主体
 */
class Game extends React.Component<GamePropsType, GameStateType> {
    constructor (props: GamePropsType) {
        super(props);
        this.state = {
            resetWinner: false,
            pieces: this.props.pieces,
            pieceType: this.props.pieceType,
            historyMap: this.props.pieceType ? new Map(this.props.ticTacORgoBang.historyTicMap) : new Map(this.props.ticTacORgoBang.historyGoBangMap),
            currentsXY: this.props.pieceType ? this.props.ticTacORgoBang.currentsTicXY : this.props.ticTacORgoBang.currentsGoBangXY,
            sliceCurentsXY: this.props.pieceType ? this.props.ticTacORgoBang.sliceCurentsTicXY : this.props.ticTacORgoBang.sliceCurentsGoBangXY,
            currentMove: this.props.pieceType ? this.props.ticTacORgoBang.currentTicMove : this.props.ticTacORgoBang.currentGoBangMove,
        };
    }
    /**
     * 重新初始化
     */
    initGame = () => {
        this.setState({
            resetWinner: false,
            pieces: this.props.pieces,
            pieceType: this.props.pieceType,
            historyMap: this.props.pieceType ? new Map(this.props.ticTacORgoBang.historyTicMap) : new Map(this.props.ticTacORgoBang.historyGoBangMap),
            currentsXY: this.props.pieceType ? this.props.ticTacORgoBang.currentsTicXY : this.props.ticTacORgoBang.currentsGoBangXY,
            sliceCurentsXY: this.props.pieceType ? this.props.ticTacORgoBang.sliceCurentsTicXY : this.props.ticTacORgoBang.sliceCurentsGoBangXY,
            currentMove: this.props.pieceType ? this.props.ticTacORgoBang.currentTicMove : this.props.ticTacORgoBang.currentGoBangMove,
        });
    };
    /**
     * 重新开始 
     */
    reStart = () => {
        this.setState({
            resetWinner: !this.state.resetWinner,
            pieces: this.props.pieces,
            pieceType: this.props.pieceType,
            historyMap: new Map(),
            currentsXY: [],
            sliceCurentsXY: [],
            currentMove: 0,
        });
    };
    /**
     * 处理当前棋盘数组
     * @param nextSquares
     */
    handlePlay = (nextSquares: Map<number, Array<string | null>>, currentXY: Array<number>) => {
        this.setState({
            currentMove: nextSquares.size,
            historyMap: new Map(nextSquares),
            currentsXY: [...this.state.currentsXY, currentXY.join('')],
        });
    };
    /**
     * 历史点击
     * @param nextMove 步骤
     */
    jumpTo = (nextMove: number) => {
        this.setState({
            resetWinner: !this.state.resetWinner,
            sliceCurentsXY: this.state.currentsXY.slice(nextMove),
        });
    };

    /**
     * 监听 props state 变化
     * @param preProps
     */
    componentDidUpdate (preProps: GamePropsType) {
        if (this.props.pieceType !== preProps.pieceType && 
            this.props.pieces !== preProps.pieces
        ) {
            console.log(this.props.pieceType + 'componentDidUpdate')
            // 数据存入 redux
            this.props.saveHistory(Array.from(this.state.historyMap));
            // 棋子移动的步数
            this.props.setCurentMove(this.state.currentMove);
            // 历史记录清单
            this.props.setSliceCurrentsXY(this.state.sliceCurentsXY)
            // 当前点击的历史记录位置
            this.props.setCurrentsXY(this.state.currentsXY);
            this.props.setPieceType(this.props.pieceType)
            // 异步执行
            this.initGame();
        }

        if(this.props.pieceType !== preProps.pieceType) {
            this.setState({
                resetWinner: this.state.resetWinner,
            });
        }
    }

    render (): React.ReactNode {
        const { pieceType, currentMove, resetWinner, historyMap, sliceCurentsXY } = this.state;
        console.log(pieceType)
        const xIsNext: boolean = currentMove % 2 === 0;
        // 历史步骤
        const moves = Array(currentMove + 1).fill(null).map((squares: Array<string | null>, move: number) => {
            let description;
            if (move > 0) {
                description = `Go to move # ${move}`;
            } else {
                description = 'Go to game start';
            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{description}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-content">
                    <div className="game-board">
                        <Board pieces={this.state.pieces} pieceType={pieceType} squares={historyMap} 
                        xIsNext={xIsNext} resetWinner={resetWinner} onPlay={this.handlePlay} sliceCurentsXY={sliceCurentsXY} />
                    </div>
                    <div className="game-info">
                        <button className="game-btn" onClick={this.reStart}>重新开始</button>
                        <ol>{moves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state: { ticTacORgoBang: SliceProps; }) => {
    console.log(state)
    return {
        ticTacORgoBang: state.ticTacORgoBang
    };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        saveHistory: (data: Array<any>) => dispatch(saveHistory(data)),
        setPieceType: (data: boolean) => dispatch(setPieceType(data)),
        setCurentMove: (data: number) => dispatch(setCurentMove(data)),
        setCurrentsXY: (data: Array<string | null>) => dispatch(setCurrentsXY(data)),
        setSliceCurrentsXY: (data: Array<string | null>) => dispatch(setSliceCurrentsXY(data)),
    }
}
const GameComponent = connect(mapStateToProps, mapDispatchToProps)(Game);


/**
 * 选择棋盘类型
 */
class ChooseGame extends React.Component<{}, ChooseGameStateType> {
    constructor (props: {}) {
        super(props);
        this.state = {
            pieces: 3,
            pieceType: true,
        };
    }

    changeType = () => {
        const result = window.confirm('确认切换游戏类型？');
        if (result) {
            this.setState({
                pieces: this.state.pieceType ? 15 : 3,
                pieceType: !this.state.pieceType,
            });
        }
    }

    render () {
        const { pieces, pieceType } = this.state;
        return (
            <div>
                <button className="game-btn" onClick={this.changeType}>
                    {
                        pieceType ? '切换为五子棋' : '切换为井字棋'
                    }
                </button>
                <GameComponent pieceType={pieceType} pieces={pieces}/>
            </div>
        );
    }
}

export default ChooseGame;
