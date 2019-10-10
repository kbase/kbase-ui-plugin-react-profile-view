import React from 'react';
import flapjack from '../assets/flapjack.png'

interface Props {
    errorMessageProps: {
        errorMessages: Array<number| string>;
        fetchStatus: string;
    }
}
export default function ErrorMessage(props: Props) {
    let messageArray = props.errorMessageProps.errorMessages;
    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Something went wrong...</h2>
            <h3>Error Status Code:<span style={{ color: 'red' }}> {messageArray[0]}</span></h3>
            <h3>Error Message:<span style={{ color: 'red' }}>  {messageArray[1]}</span></h3>
            <img src={flapjack} />
            <p></p>
            <h3>Please contact KBase via  <a href='http://kbase.us/contact-us/' target='_blank'>Help Board</a>.</h3>
           
        </div>
    )
};