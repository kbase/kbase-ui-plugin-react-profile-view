import { BaseStoreState } from "@kbase/ui-lib";
export interface StoreState extends BaseStoreState,  NarrativeState, ProfileState, OrgState {}
import { profileFetchStatuses } from '../redux/fetchStatuses';
export interface UserAuthorization {
    realname: string;
    role?: Array<string>;
    token: string;
    username: string;
}

/**
 * Narrative 
 */
export interface NarrativeData {
    wsID: string;
    permission: string;
    name: string;
    last_saved: number;
    users: object;
    narrative_detail: {
        creator: string;
    };
}

// used in reducer 
export interface NarrativeAction {
    type: string;
    payload: {
        narrativeList: Array<NarrativeData>;
        loading: boolean;
    }
}

// need this for adding type to StoreState - see store.ts
export interface NarrativeState {
    narrativeState: {
        narrativeList: Array<NarrativeData>;
        loading: boolean;
    }
}


/**
 * Orgs  
 */

// used in reducer 
export interface OrgsAction {
    type: string;
    payload: {
        orgList: Array<OrgProp>,
        loading: boolean
    }
}


// need this for adding type to StoreState - see store.ts
export interface  OrgState {
    orgState: {
        orgList: Array<OrgProp>,
        loading: boolean
    }
}

// Used for org list 
export interface OrgProp {
    name: string;
    url: string;
}

// fetchOrgsOfProfile returns a full group info,
// but only name and id is needed to make OrgProp
export interface Org {
    name: string;
    id: string;
}


/**
 * Profile 
 */

/**
 * user profile service uses this type
 * typedef structure {
        User user;
        UnspecifiedObject profile;
    } UserProfile;
 *  "UnspecifiedObject profile;"
 * is pecified below
 */
export interface UserProfileService {
    user: UsernameRealname;
    profile: {
        userdata: ProfileData,
        synced:{
            gravatarHash: string;
        }
    };
    
}

// user profile servie resturns
// converted to UserName 
// https://github.com/kbase/user_profile/blob/master/UserProfile.spec
export interface UsernameRealname {
    username: string;
    realname: string;
}


// need this for adding type to StoreState - see store.ts
export interface  ProfileState {
    profileView: ProfileView | ProfileFetchStatus
}

export interface ProfileFetchStatus{
    profileFetchStatus: profileFetchStatuses.NONE | profileFetchStatuses.ERROR | profileFetchStatuses.SUCCESS | profileFetchStatuses.FETCHING;
}


export interface ProfileView {
    userName: UserName,
    profileData: ProfileData,
    gravatarHash: string,
    profileFetchStatus: profileFetchStatuses.SUCCESS
}

export interface ProfileData {
    organization: string;
    department: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    affiliations: Array<Affiliation>;
    researchStatement: string;
    jobTitle: string;
    jobTitleOther: string;
    researchInterests: Array<string>;
    fundingSource: string;
    gravatarDefault: string;
    avatarOption: string;
}

export interface Affiliation {
    title: string;
    organization: string;
    started: string;
    ended: string;
}

// used in Profile View app
export interface UserName {
    name: string;
    userID: string;
}

// used in reducer 
export interface loadProfileAction {
    type: string;
    payload: ProfileView;
}



