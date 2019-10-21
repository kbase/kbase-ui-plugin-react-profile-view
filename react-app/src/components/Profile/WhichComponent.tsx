import React from 'react';

import Profile from './Profile';
import Spinner from '../../pages/Spinner';
import ErrorMessage from '../../pages/ErrorMessage'


export default function WhichComponent(props: any) {
    switch (props.profileFetchStatus) {
        case 'none':
            return <Spinner />;

        case 'fetching':
            return <Spinner />;

        case 'success':
            return <Profile userName={props.userName}
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