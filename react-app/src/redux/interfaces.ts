import { BaseStoreState } from "@kbase/ui-components";
export interface StoreState extends BaseStoreState, NarrativeState, ProfileState, OrgState { }
import { AsyncFetchStatus } from '../redux/fetchStatuses';

export interface UserAuthorization {
    realname: string;
    role?: Array<string>;
    token: string;
    username: string;
};

/**
 * Narrative 
 */
export interface NarrativeData {
    wsID: string;
    permission: string;
    name: string;
    last_saved: number;
    users: object;
    owner: string;
    narrative_detail: {
        creator: string;
    };
};

// used in reducer 
export interface NarrativeAction {
    type: string;
    payload: {
        narrativeList: Array<NarrativeData>;
        loading: boolean;
        isOwner: boolean;
    };
};

// need this for adding type to StoreState - see store.ts
export interface NarrativeState {
    narrativeState: {
        narrativeList: Array<NarrativeData>;
        loading: boolean;
        isOwner: boolean;
    };
};


/**
 * Orgs  
 */

// used in reducer 
// need this for adding type to StoreState - see store.ts
export interface OrgState {
    orgState: OrgList | OrgFetchStatus | OrgFetchError;
};

export interface OrgList {
    orgList: Array<OrgProp>,
    orgFetchStatus: AsyncFetchStatus.SUCCESS | AsyncFetchStatus.REFETCHING;
};

export interface OrgFetchError {
    orgError: Array<number | string>,
    orgFetchStatus: AsyncFetchStatus.ERROR;
};

export interface OrgFetchStatus {
    orgFetchStatus: AsyncFetchStatus.NONE | AsyncFetchStatus.FETCHING;
};

// Used for org list 
export interface OrgProp {
    name: string;
    url: string;
    logoURL?: string;
};

// fetchOrgsOfProfile returns a full group info,
// but only name and id is needed to make OrgProp
export interface Org {
    name: string;
    id: string;
    custom: {
        description: string;
        homeurl: string;
        logourl: string;
        relatedgroups: string;
        researchinterests: string;
    };
    // TODO: rest of the fields!!
};




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
        userdata: ProfileUserdata,
        synced: {
            gravatarHash: string;
        };
        // TODO: the rest of the profile structure, at least preserved
        // as any??
    };

};

// user profile servie resturns
// converted to UserName 
// https://github.com/kbase/user_profile/blob/master/UserProfile.spec
export interface UsernameRealname {
    username: string;
    realname: string;
};


// need this for adding type to StoreState - see store.ts
export interface ProfileState {
    profileView: ProfileView | ProfileFetchStatus | ErrorMessages;
};

export interface ErrorMessages {
    errorMessages: Array<number | string>;
    profileFetchStatus: AsyncFetchStatus.ERROR;
};

export interface ProfileFetchStatus {
    profileFetchStatus: AsyncFetchStatus.NONE | AsyncFetchStatus.FETCHING;
};

export interface ProfileView {
    userName: UserName,
    editEnable: boolean,
    profileUserdata: ProfileUserdata,
    gravatarHash: string,
    profileFetchStatus: AsyncFetchStatus.SUCCESS | AsyncFetchStatus.REFETCHING;
};

export interface ProfileUserdata {
    organization: string | null;
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
    researchInterestsOther: string | null;
    fundingSource: string;
    gravatarDefault: string;
    avatarOption: string;
};

export interface Affiliation {
    title: string;
    organization: string;
    started: number;
    ended: number | null;
};

// used in Profile View app
// TODO: please refactor, someone; having UserName as something
// other than a username string is unnecessarily confusing.
export interface UserName {
    name: string;
    userID: string;
};

// used in reducer 
export interface loadProfileAction {
    type: string;
    payload: ProfileView | ProfileFetchStatus | ErrorMessages;
};
