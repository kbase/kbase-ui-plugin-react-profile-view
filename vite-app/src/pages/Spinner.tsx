import { Spin } from 'antd';

/**
 * returns spinner page
 * @param props 
 */
export default function Spinner() {
    return (
        <div style={{ textAlign: 'center' }}><Spin size="large" /></div>
    )
}