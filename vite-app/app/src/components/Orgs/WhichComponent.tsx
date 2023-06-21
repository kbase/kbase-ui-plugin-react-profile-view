import ErrorMessage from '../../pages/ErrorMessage';
import Spinner from '../../pages/Spinner';
import Orgs from './Orgs';

export default function WhichComponent(props: any) {
    switch (props.orgFetchStatus) {
        case 'none':
            return <Spinner />;
        case 'fetching':
            return <Spinner />;
        case 'success':
            return <Orgs orgList={props.orgList} />;
        case 'error':
            return <ErrorMessage errorMessageProps={props} />;
        default:
            return <div>???</div>;
    }
}
