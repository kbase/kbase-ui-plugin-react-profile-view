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

export interface UserName {
    name: string;
    userID: string;
}


export interface FilteredUser {
    username: string;
    realname: string;
}

export interface Response {
    version: string;
    result: Array<any>;
}

export interface NarrativeState {
    narrativeDataArray: Array<NarrativeData>; 
}