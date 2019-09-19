import React from 'react';

interface Props {
    errorMessage: Array<String>
}
export default function ErrorMessage(props:Props) {
    return(
        <div style={{ textAlign: 'center' }}><p>Something went wrong...{props.errorMessage[0]}, {props.errorMessage[1]} </p></div>
    )
}