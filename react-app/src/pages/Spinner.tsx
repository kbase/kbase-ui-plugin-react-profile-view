import React from 'react';
import { Spin } from 'antd';


export default function Spinner(props: any) {
    return (
        <div style={{ textAlign: 'center' }}><Spin size="large" /></div>
    )
}