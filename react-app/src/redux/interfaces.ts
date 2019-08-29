import { BaseStoreState } from "@kbase/ui-lib";
export interface StoreState extends BaseStoreState,  NarrativeState, ProfileState, OrgState {}

export interface UserAuthorization {
    realname: string;
    role?: Array<string>;
    token: string;
    username: string;
}

export interface Narrative_detail {
    creator: string;
}

export interface NarrativeData {
    wsID: string;
    permission: string;
    name: string;
    last_saved: number;
    users: object;
    narrative_detail: Narrative_detail;
}

// used in reducer 
export interface NarrativeActionType {
    type: string;
    payload: {
        narrativeList: Array<NarrativeData>;
        loading: boolean;
    }
}

// used in reducer 
export interface OrgsActionType {
    type: string;
    payload: {
        orgList: Array<OrgProp>,
        loading: boolean
    }
}

// need this for adding type to StoreState - see store.ts
export interface NarrativeState {
    narrativeState: {
        narrativeList: Array<NarrativeData>;
        loading: boolean;
    }
}

// need this for adding type to StoreState - see store.ts
export interface  ProfileState {
    profileView: ProfileView
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

export interface Affiliation {
    title: string;
    organization: string;
    started: string;
    ended: string;
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

// used in reducer 
export interface ProfileActionType {
    type: string;
    payload: ProfileView;
}


export interface ProfileView {
    userName: UserName,
    profileData: ProfileData,
    gravatarHash: string
}

// used in Profile View app
export interface UserName {
    name: string;
    userID: string;
}

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
