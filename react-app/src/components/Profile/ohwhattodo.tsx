import React from 'react';

import ProfileClass from './ProfileClass';
import Spinner from '../Spinner';
import ErrorMessage from '../ErrorMessage'

export default function OhWhat(props: any) {
    switch (props.profileFetchStatus) {
        case 'none':
            return <Spinner />;
            break;

        case 'fetching':
            return <Spinner />;
            break;

        case 'success':
            return <ProfileClass userName={props.userName}
                editEnable={props.editEnable}
                profileData={props.profileData}
                gravatarHash={props.gravatarHash}
                profileFetchStatus={props.profileFetchStatus}
                updateProfile={props.updateProfile} />;
            break;

        case 'error':
            return <ErrorMessage
                errorMessage={['status code', 'statusText']}
            />;
            break;

        default:
            return (<div>hello</div>);
            break;

    }

}