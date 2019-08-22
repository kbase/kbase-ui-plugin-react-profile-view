import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { OrgProp, UserName, ProfileData, NarrativeData, StoreState } from '../../redux/interfaces';
import { loadNarratives} from '../../redux/actions/index';
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


/// when home page is loaded, it triggers action to fetch API call
// to get profile info.
// then store state will get populated by the user profile 
// then dispatch? update the component this component? 

function mapStateToProps(state: StoreState): StoreState {
    console.log("mockProfileContainer mapStateToProp", state);
    return state
}



function ProfileContainer(props:Props) {
    
    return (
        <Profile
            baseURL={props.baseURL}
            token={props.token}
            userName={props.userName}
            editEnable={props.editEnable}
            userProfile={props.userProfile}
            orgs={props.orgs}
            gravatarHash={props.gravatarHash}
            profileloaded={props.profileloaded}
            orgsloaded={props.orgsloaded}
        />
    )

}

export default connect(mapStateToProps, null)(ProfileContainer);

