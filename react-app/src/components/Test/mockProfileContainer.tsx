import React from 'react';
import { connect } from 'react-redux';
import MockProfile from './MockProfile';
import { StoreState, UserName, ProfileData, OrgProp } from '../../redux/interfaces';


/// when home page is loaded, it triggers action to fetch API call
// to get profile info.
// then store state will get populated by the user profile 
// then dispatch? update the component this component? 

function mapStateToProps(state: StoreState): StoreState {
    console.log("mockProfileContainer mapStateToProp", state);
    return state
}

interface Props {
    token: string;
    userName: UserName;
    editEnable: Boolean;
    userProfile: ProfileData;
    orgs: Array<OrgProp>;
    gravatarHash: string;
    profileloaded: Boolean;
    orgsloaded: Boolean;
}

function MockProfileContainer(props:Props) {
    console.log("mockProfileContainer props", props);

    return (
    <MockProfile 
        userName={props.userName}
        editEnable={props.editEnable}
        userProfile={props.userProfile}
        orgs={props.orgs}
        gravatarHash={props.gravatarHash}
        profileloaded={props.profileloaded}
        orgsloaded={props.orgsloaded}
        token={props.token}
    />)

}

export default connect(mapStateToProps, null)(MockProfileContainer);
