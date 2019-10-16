import React from 'react';

import ProfileClass from './ProfileClass';
import Spinner from '../../pages/Spinner';
import ErrorMessage from '../../pages/ErrorMessage'


export default function OhWhat(props: any) {
    switch (props.profileFetchStatus) {
        case 'none':
            return <Spinner />;

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

        case 'error':
            let newErrorMessageProps = {
                errorMessages: props.errorMessages,
                fetchStatus: props.profileFetchStatus
            };
            return <ErrorMessage
                errorMessageProps={newErrorMessageProps}
            />;

        default:
            return (<div>???</div>);

    };

};