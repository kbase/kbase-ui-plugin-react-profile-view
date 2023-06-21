import ErrorMessage from '../../pages/ErrorMessage';
import { NarrativeData } from '../../redux/interfaces'; //interface
import Narratives from './Narratives';

interface Props {
    narratives: Array<NarrativeData> | Array<number | string>;
    loading: boolean;
    isOwner: boolean;
}

export default function WhichComponent(props: Props) {
    if (typeof props.narratives[0] === 'number') {
        const errorStatus = props.narratives[0];
        const errorText = props.narratives[1] as string;
        const errorMessagesArray: Array<number | string> = [errorStatus, errorText];
        const errorMessageProps = {
            errorMessages: errorMessagesArray,
            fetchStatus: 'error'
        };
        return <ErrorMessage
            errorMessageProps={errorMessageProps}
        />;
    } else {
        const narrativeList = props.narratives as Array<NarrativeData>;

        return <Narratives
            narratives={narrativeList}
            loading={props.loading}
            isOwner={props.isOwner}
        />;
    }
}