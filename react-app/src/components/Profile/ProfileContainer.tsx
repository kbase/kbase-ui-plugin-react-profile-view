import React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import { UserName, ProfileData, StoreState, ProfileView, ProfileFetchStatus } from '../../redux/interfaces';
import {  updateProfile } from '../../redux/actions';
import whichcomponent from './WhichComponent';

import { profileFetchStatuses } from '../../redux/fetchStatuses';

interface PropsWithProfileData {
    userName: UserName;
    editEnable: Boolean;
    profileData: ProfileData;
    gravatarHash: string;
    profileFetchStatus: string;
};
interface PropsWithoutProfileData {
    profileFetchStatus: string;
};

type Props = PropsWithoutProfileData | PropsWithProfileData;

interface DispatchProps {
    updateProfile: (profileID: string) => void;
};


interface OwnProps {};
let component: JSX.Element;
function mapStateToProps(state: StoreState): Props {
    console.log('profile state container', state)
    // token can be null
    let userAuthToken;
    if( state.auth.userAuthorization !== null ) {
        userAuthToken = state.auth.userAuthorization.token
    } else {
        userAuthToken = '';
    }
    switch(state.profileView.profileFetchStatus) {
        case profileFetchStatuses.NONE:
            return {
                    profileFetchStatus: state.profileView.profileFetchStatus,
                }
                break;

        case profileFetchStatuses.NONE:
            return {
                    profileFetchStatus: state.profileView.profileFetchStatus,
                }
                break;
                
        case profileFetchStatuses.SUCCESS:
            let foo = state.profileView as ProfileView;
            return {
                userName: foo.userName,
                editEnable: false,
                profileData: foo.profileData,
                gravatarHash: foo.gravatarHash,
                profileFetchStatus: foo.profileFetchStatus
            }
            break;

        default:
            return {profileFetchStatus: state.profileView.profileFetchStatus}
            break;
    }

};


function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        updateProfile: (profileID: string) => {
            return dispatch(updateProfile(profileID) as any);
        }
    };
};

export default connect<Props, DispatchProps, OwnProps, StoreState>(
    mapStateToProps, 
    mapDispatchToProps
)(whichcomponent);
