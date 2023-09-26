import { useState } from 'react';

/**
 * 添加游戏
 * @returns
 */
export default function AddGame () {
    const [gameSetting, setGameSetting] = useState({
        name: undefined,
        boardLength: undefined,
        victoryBaseReason: undefined,
        chessType: [],
    });
    /**
     * 改变
     */
    const handleCange = (event: { target: {value: string, name: string}}) => {
        setGameSetting({ ...gameSetting, [event.target.name]: event.target.value });
    };
    return (
        <div>
            <div style={{ display: 'grid' }}>
                <div>添加游戏</div>
                <label>
                    游戏名字：<input name="name" value={gameSetting.name} onChange={handleCange} />
                </label>
                <label>
                    棋盘格长宽比例：<input name="boardLength" value={gameSetting.boardLength} onChange={handleCange} />
                </label>
                <label>
                    胜利条件：<input name="victoryBaseReason" value={gameSetting.victoryBaseReason} onChange={handleCange} />
                </label>
                {/* <label>
                    <span>双方棋子类型：</span>
                    <input name="myInput" value={gameSetting.chessType[0]} onChange={handleCange} />
                    <input name="myInput" value={gameSetting.chessType[1]} onChange={handleCange} />
                </label> */}
            </div>
            <button>添加游戏</button>
        </div>
    );
}
