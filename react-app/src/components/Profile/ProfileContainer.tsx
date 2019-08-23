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
    userProfile: ProfileData;
    orgs: Array<OrgProp>;
    gravatarHash: string;
    profileloaded: Boolean;
    orgsloaded: Boolean;
}

interface DispatchProps {
    updateProfile: (profileID: string) => void;
}


interface OwnProps {}

function mapStateToProps(state: StoreState): Props {
    console.log("ProfileContainer mapStateToProp", state);
    return {
        baseURL: "",
        token: "",
        userName: {
            userID: "",
            name:''
        },
        editEnable:false,
        userProfile: {
            organization: '',
            department: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            affiliations: [],
            researchStatement: '',
            jobTitle: '',
            jobTitleOther: '',
            researchInterests: [],
            fundingSource: '',
            gravatarDefault: '',
            avatarOption: ''
        },
        orgs: [],
        gravatarHash:"",
        profileloaded: true,
        orgsloaded: true
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        updateProfile: (profileID: string) => {
            return dispatch(updateProfile(profileID) as any);
        }
    }
}

// function ProfileContainer(props:Props) {
    
//     return (
//         <Profile
//             baseURL={props.baseURL}
//             token={props.token}
//             userName={props.userName}
//             editEnable={props.editEnable}
//             userProfile={props.userProfile}
//             orgs={props.orgs}
//             gravatarHash={props.gravatarHash}
//             profileloaded={props.profileloaded}
//             orgsloaded={props.orgsloaded}
//         />
//     )

// }
export default connect<Props, DispatchProps, OwnProps, StoreState>(
    mapStateToProps, 
    mapDispatchToProps
    )(Profile);
