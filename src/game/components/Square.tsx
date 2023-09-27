import React from 'react';
import { SquareProps } from '../type/index';

/**
 * 格子
 * @param content 格子的内容
 * @param direction 格子的坐标
 * @returns
 */
const Square: React.FC<SquareProps> = ({ content, direction }) => {
    return (
        <div className="square" data-direction={direction}>
            {content}
        </div>
    );
};

export default React.memo(Square);
