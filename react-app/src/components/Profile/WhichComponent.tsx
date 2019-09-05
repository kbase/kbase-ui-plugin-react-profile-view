import React from 'react';

import Profile from './Profile';
import Spinner from '../Spinner';
import ErrorMessage from '../ErrorMessage'

export default function WhichComponent(props:any) {
    console.log('whichcomponent', props)
    let foo = props
    switch(foo.profileFetchStatus){
        case 'none':
            return <Spinner />;
            break;

        case 'fetching':
                return <Spinner />;
                break;

        case 'success':
            return <Profile userName={props.userName} 
            editEnable= {props.editEnable}
            profileData= {props.profileData}
            gravatarHash= {props.gravatarHash}
            profileFetchStatus= {props.profileFetchStatus}/>;
            break;

        case 'error':
            return <ErrorMessage />;
            break;

        default: 
            return ( <div>hello</div>);
            break;

    }
     
}