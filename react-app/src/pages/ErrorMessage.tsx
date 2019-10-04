import React from 'react';
import Octopus from '../assets/Octopus.png'

interface Props {
    errorMessageProps: {
        errorMessages: Array<number| string>;
        fetchStatus: string;
    }
}
export default function ErrorMessage(props: Props) {
    console.log(props)
    let messageArray = props.errorMessageProps.errorMessages;
    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Something went wrong...</h2>
            <h3>Error Status Code:<span style={{ color: 'red' }}> {messageArray[0]}</span></h3>
            <h3>Error Message:<span style={{ color: 'red' }}>  {messageArray[1]}</span></h3>
            <img src={Octopus} />
        </div>
    )
}