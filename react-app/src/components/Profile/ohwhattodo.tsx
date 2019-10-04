import React from 'react';

import ProfileClass from './ProfileClass';
import Spinner from '../../pages/Spinner';
import ErrorMessage from '../../pages/ErrorMessage'


export default function OhWhat(props: any) {
    console.log('ohwhattodo', props)
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
            let newErrorMessageProps = {
                errorMessages: props.errorMessages,
                fetchStatus: props.profileFetchStatus
            };
            return <ErrorMessage
                errorMessageProps={newErrorMessageProps}
            />;
            break;

        default:
            return (<div>hello</div>);
            break;

    };

};