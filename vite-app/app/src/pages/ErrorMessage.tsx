import flapjack from '../assets/flapjack.png';

interface Props {
    errorMessageProps: {
        errorMessages: Array<number | string>;
        fetchStatus: string;
    };
}

/**
 * Error message page
 *  - it takes an array of [status(number), statusText(string)] as props
 *  - and fetchStatus as string 
 * @param props 
 */
export default function ErrorMessage(props: Props) {
    const messageArray = props.errorMessageProps.errorMessages;
    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Something went wrong...</h2>
            <h3>Error Message:<span style={{ color: 'red' }}>  {messageArray[0]}</span></h3>
            <img src={flapjack} alt='confused flapjack octopus' />
            <p></p>
            <h3>Please contact KBase via  <a href='http://kbase.us/contact-us/' target='_blank' rel="noopener noreferrer">Help Board</a>.</h3>

        </div>
    );
}