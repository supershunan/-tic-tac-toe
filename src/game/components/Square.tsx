import React from 'react';

interface SquareProps {
    /**
     * @param 格子的内容
     */
    content: string | null | undefined;
    /**
     * 点击格子
     */
    onSquareClick: () => void;
}

/**
 * 格子
 * @param content 格子的内容
 * @param onSquareClick 格子的点击事件
 * @returns
 */
const Square: React.FC<SquareProps> = ({ content, onSquareClick }) => {
    return (
        <button className="square" onClick={onSquareClick}>
            {content}
        </button>
    );
};

export default Square;
