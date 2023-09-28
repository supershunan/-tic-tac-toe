import React, { useState } from 'react';
import { gameSettings } from '../../game-setting';
import { AddGameProps } from '../type/index';

/**
 * 添加游戏
 * @returns
 */
const AddGame: React.FC<AddGameProps> = ({ onDataChange }) => {
    const [gameSetting] = useState({
        name: undefined,
        type: undefined,
        boardLength: undefined,
        victoryBaseReason: undefined,
        chessTypeFist: undefined,
        chessTypeSecond: undefined,
    });
    /**
     * 提交表单
     */
    const handleSubmit = (event: any) => {
        // 阻止浏览器重新加载页面
        event.preventDefault();
        // 读取表单数据
        const form = event.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        const { name, type, boardLength, victoryBaseReason, chessTypeFist, chessTypeSecond } = formJson;
        gameSettings.push({
            name: String(name),
            type: String(type),
            boardLength: Number(boardLength),
            victoryBaseReason: Number(victoryBaseReason),
            chessType: [String(chessTypeFist), String(chessTypeSecond)],
        });
        onDataChange(gameSettings);
    };

    return (
        <div>
            <div style={{ display: 'grid' }}>
                <div>添加棋盘游戏</div>
            </div>
            <button style={{ marginTop: '10px' }}>添加游戏</button>

            <form method="post" onSubmit={handleSubmit}>
                <label>
                    <div>游戏名字：</div>
                    <input name="name" value={gameSetting.name} />
                </label>
                <label>
                    <div>游戏英文名字：</div>
                    <input name="type" value={gameSetting.type} />
                </label>
                <label>
                    <div>棋盘格长宽(相同n*n)：</div>
                    <input type='boardLength' name="boardLength" value={gameSetting.boardLength} />
                </label>
                <label>
                    <div>胜利条件：</div>
                    <input type='number' name="victoryBaseReason" value={gameSetting.victoryBaseReason} />
                </label>
                <label>
                    <div>双方棋子类型(例如：⚫, ⚪)：</div>
                    <input name="chessTypeFist" value={gameSetting.chessTypeFist} />
                    <div><input name="chessTypeSecond" value={gameSetting.chessTypeSecond} /></div>
                </label>
                <button type="reset">重置表单</button>
                <button type="submit">提交表单</button>
            </form>
        </div>
    );
};

export default AddGame;
