import { BaseStoreState } from "@kbase/ui-lib";
export interface StoreState extends BaseStoreState,  NarrativeState {}

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

// org data that
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

// used in app
export interface UserName {
    name: string;
    userID: string;
}

// user profile servie resturns
// converted to UserName 
// https://github.com/kbase/user_profile/blob/master/UserProfile.spec
export interface FilteredUser {
    username: string;
    realname: string;
}

export interface NarrativeState {
    narrativeDataArray: Array<NarrativeData>; 
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
    'user': FilteredUser;
    'profile': {
        'userdata': ProfileData;
    };
    'synced':{
        'gravatarHash': string;
    }
}

export interface UpdatedUserData { 
    profile: {
        userdata: ProfileData
    }
}