import React from 'react';
import './Area.css';

export interface AreaProps {
    title?: string;
    maxHeight?: string;
    style?: React.CSSProperties;
}

interface AreaState {

}

export default class Area extends React.Component<AreaProps, AreaState> {
    render() {
        const bodyStyle: React.CSSProperties = {
        };
        if (this.props.maxHeight) {
            bodyStyle.maxHeight = this.props.maxHeight;
            bodyStyle.overflowY = 'auto';
        }
        let title;
        if (this.props.title) {
            title = <div className="Area-title">{this.props.title}</div>;
        }
        return <div className='Area' style={this.props.style}>
            {title}
            <div className="Area-body" style={bodyStyle}>
                {this.props.children}
            </div>
        </div>;
    }
}