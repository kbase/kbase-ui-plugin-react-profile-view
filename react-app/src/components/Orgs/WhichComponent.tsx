import React from 'react';

import Orgs from './Orgs';
import Spinner from '../../pages/Spinner';
import ErrorMessage from '../../pages/ErrorMessage';

export default function WhichComponent(props: any) {
    switch (props.orgFetchStatus) {
        case 'none':
            return <Spinner />;
            break;

        case 'fetching':
            return <Spinner />;
            break;

        case 'success':
            return <Orgs orgList={props.orgList} />;
            break;

        case 'error':

            return <ErrorMessage
                    errorMessageProps={props}
            />;
            break;

        default:
            return (<div>hello</div>);
            break;

    }

}