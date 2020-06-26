import React from 'react';
import ErrorMessage from '../../pages/ErrorMessage';
import Narratives from './Narratives';
import { NarrativeData } from '../../redux/interfaces'; //interface

interface Props {
    narratives: Array<NarrativeData> | Array<number | string>;
    loading: boolean;
    isOwner: boolean;
}

export default function WhichComponent(props: Props) {
    if (typeof props.narratives[0] === 'number') {
        let errorStatus = props.narratives[0];
        let errorText = props.narratives[1] as string;
        let errorMessagesArray: Array<number | string> = [errorStatus, errorText];
        let errorMessageProps = {
            errorMessages: errorMessagesArray,
            fetchStatus: 'error'
        };
        return <ErrorMessage
            errorMessageProps={errorMessageProps}
        />;
    } else {
        let narrativeList = props.narratives as Array<NarrativeData>;

        return <Narratives
            narratives={narrativeList}
            loading={props.loading}
            isOwner={props.isOwner}
        />;
    };
};