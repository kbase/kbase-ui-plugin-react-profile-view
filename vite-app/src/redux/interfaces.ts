import { BaseStoreState } from "@kbase/ui-components";
import { AsyncProcess } from "@kbase/ui-lib/lib/AsyncProcess";
import { ProfileWarnings, UserProfilePreferences, UserProfileUser, UserProfileUserdata } from "../util/API";
import { AsyncFetchState } from './asyncFetchState';

export interface SupplementalBaseState {
    uiOrigin: string
}

export interface StoreState extends BaseStoreState {
    orcidState: ORCIDState
    profileState: ProfileState
    orgsState: OrgsState
    narrativeState: NarrativesState
    supplementalBaseState: SupplementalBaseState
}


export interface UserAuthorization {
    realname: string;
    role?: Array<string>;
    token: string;
    username: string;
}

// ORCID


export type ORCIDView = {
    orcidId: string | null;
}

export interface SimpleError {
    message: string;
}

export type ORCIDState = AsyncProcess<ORCIDView, SimpleError>;


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
}

export interface NarrativesView {
    narrativesList: Array<NarrativeData>;
    // huh?
    isOwner: boolean;
}

export interface SimpleError {
    message: string;
}

export type NarrativesState = AsyncProcess<NarrativesView, SimpleError>

/**
 * Orgs  
 */

export interface Org {
    name: string;
    url: string;
    logoURL?: string;
}

export interface OrgsView {
    orgs: Array<Org>
}

// TODO: what is up with this error type??

export type OrgsState = AsyncFetchState<OrgsView, SimpleError>;

export interface UserProfileSubset {
    userdata: UserProfileUserdata
    preferences?: UserProfilePreferences
    gravatarHash: string
}

export interface ProfileView {
    user: UserProfileUser
    profile: UserProfileSubset
    editEnable: boolean,
    warnings: ProfileWarnings
}

export type ProfileState = AsyncFetchState<ProfileView, SimpleError>
