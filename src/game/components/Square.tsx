import React from 'react';
import { SquareProps } from '../type/index';

export default class Square extends React.Component<SquareProps, {}> {
    constructor (props: SquareProps) {
        super(props);
    }
    shouldComponentUpdate (nextProps: Readonly<SquareProps>): boolean {
        if (nextProps.direction === this.props.direction && nextProps.content === this.props.content) {
            return false;
        }
        return true;
    }
    render (): React.ReactNode {
        const { direction, content } = this.props;
        return (
            <div className="square" data-direction={direction}>
                {content}
            </div>
        );
    }
}
