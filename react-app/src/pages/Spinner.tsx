import React from 'react';
import { Spin } from 'antd';

/**
 * returns spinner page
 * @param props 
 */
export default function Spinner(props: any) {
    return (
        <div style={{ textAlign: 'center' }}><Spin size="large" /></div>
    )
}