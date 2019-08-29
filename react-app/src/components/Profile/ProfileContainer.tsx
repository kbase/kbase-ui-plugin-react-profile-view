import React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import { OrgProp, UserName, ProfileData, StoreState } from '../../redux/interfaces';
import {  updateProfile } from '../../redux/actions';
import Profile from './Profile';


interface Props {
    baseURL: string;
    token: string;
    userName: UserName;
    editEnable: Boolean;
    profileData: ProfileData;
    orgs: Array<OrgProp>;
    gravatarHash: string;
    profileloaded: Boolean;
    orgsloaded: Boolean;
};

interface DispatchProps {
    updateProfile: (profileID: string) => void;
};


interface OwnProps {};

function mapStateToProps(state: StoreState): Props {

    // token can be null
    let userAuthToken;
    if( state.auth.userAuthorization !== null ) {
        userAuthToken = state.auth.userAuthorization.token
    }
    return {
        baseURL: state.app.config.baseUrl,
        token: userAuthToken ? userAuthToken : '', 
        userName: {
            userID: state.profileView.userName.userID,
            name: state.profileView.userName.name
        },
        editEnable:false,
        profileData: {
            organization: state.profileView.profileData.organization,
            department: state.profileView.profileData.department,
            city: state.profileView.profileData.city,
            state: state.profileView.profileData.state,
            postalCode: state.profileView.profileData.postalCode,
            country: state.profileView.profileData.country,
            affiliations: state.profileView.profileData.affiliations,
            researchStatement: state.profileView.profileData.researchStatement,
            jobTitle: state.profileView.profileData.jobTitle,
            jobTitleOther: state.profileView.profileData.jobTitleOther,
            researchInterests: state.profileView.profileData.researchInterests,
            fundingSource: state.profileView.profileData.fundingSource,
            gravatarDefault: state.profileView.profileData.gravatarDefault,
            avatarOption: state.profileView.profileData.avatarOption
        },
        orgs: [],
        gravatarHash: state.profileView.gravatarHash,
        profileloaded: true,
        orgsloaded: true
    }
    
};


function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        updateProfile: (profileID: string) => {
            return dispatch(updateProfile(profileID) as any);
        }
    }
};


export default connect<Props, DispatchProps, OwnProps, StoreState>(
    mapStateToProps, 
    mapDispatchToProps
)(Profile);
