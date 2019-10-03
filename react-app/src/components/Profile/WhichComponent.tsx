import React from 'react';

import Profile from './Profile';
import ProfileClass from './Profile';
import Spinner from '../../pages/Spinner';
import ErrorMessage from '../../pages/ErrorMessage'

export default function WhichComponent(props: any) {
    // console.log('whichcomponent', props)
    switch (props.profileFetchStatus) {
        case 'none':
            return <Spinner />;
            break;

        case 'fetching':
            return <Spinner />;
            break;

        case 'success':
            return <Profile userName={props.userName}
                editEnable={props.editEnable}
                profileData={props.profileData}
                gravatarHash={props.gravatarHash}
                profileFetchStatus={props.profileFetchStatus}
                updateProfile={props.updateProfile} />;
            break;

        case 'error':
            let newProps = {
                fetchStatus: 'error',
                errorMessages: ['status code', 'errorMessages']
            }
            return <ErrorMessage
                    errorMessageProps={newProps}
            />;
            break;

        default:
            return (<div>hello</div>);
            break;

    }

}