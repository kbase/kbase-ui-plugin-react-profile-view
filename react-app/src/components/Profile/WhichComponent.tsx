import React from 'react';

import Profile from './Profile';
import Spinner from '../../pages/Spinner';
import ErrorMessage from '../../pages/ErrorMessage';

export default function WhichComponent(props: any) {
    switch (props.profileFetchStatus) {
        case 'none':
            return <Spinner />;

        case 'fetching':
            return <Spinner />;


        case 'refetching':
            return <Profile userName={props.userName}
                editEnable={props.editEnable}
                profileUserdata={props.profileData}
                gravatarHash={props.gravatarHash}
                profileFetchStatus={props.profileFetchStatus}
                updateProfile={props.updateProfile} />;

        case 'success':
            return <Profile userName={props.userName}
                editEnable={props.editEnable}
                profileUserdata={props.profileData}
                gravatarHash={props.gravatarHash}
                profileFetchStatus={props.profileFetchStatus}
                updateProfile={props.updateProfile} />;

        case 'error':
            const newErrorMessageProps = {
                errorMessages: props.errorMessages,
                fetchStatus: props.profileFetchStatus
            };
            return <ErrorMessage
                errorMessageProps={newErrorMessageProps}
            />;

        default:
            return (<div>???</div>);
    }
}
