import { NarrativesView, OrgsView, ProfileView, SimpleError } from "../interfaces"

export enum ActionTypes {
    FETCH_PROFILE = 'FETCH_PROFILE',
    FETCH_PROFILE_NONE = 'FETCH_PROFILE_NONE',
    FETCH_PROFILE_FETCHING = 'FETCH_PROFILE_FETCHING',
    FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS',
    FETCH_PROFILE_ERROR = 'FETCH_PROFILE_ERROR',
    FETCH_PROFILE_REFETCHING = 'FETCH_PROFILE_REFETCHING',

    FETCH_ORGS = 'FETCH_ORGS',
    FETCH_ORGS_NONE = 'INITIAL_RENDER_ORGS',
    FETCH_ORGS_FETCHING = 'FETCH_ORGS_FETCHING',
    FETCH_ORGS_SUCCESS = 'FETCH_ORGS_SUCCESS',
    FETCH_ORGS_ERROR = 'FETCH_ORGS_ERROR',
    FETCH_ORGS_REFETCHING = 'FETCH_ORGS_REFETCHING',

    FETCH_NARRATIVES = 'FETCH_NARRATIVES',
    FETCH_NARRATIVES_NONE = 'FETCH_NARRATIVES_NONE',
    FETCH_NARRATIVES_FETCHING = 'FETCH_NARRATIVES_FETCHING',
    FETCH_NARRATIVES_SUCCESS = 'FETCH_NARRATIVES_SUCCESS',
    FETCH_NARRATIVES_ERROR = 'FETCH_NARRATIVES_ERROR',

    FETCH_ORCID = 'FETCH_ORCID_ID',
    FETCH_ORCID_NONE = 'FETCH_ORCID_ID_NONE',
    FETCH_ORCID_PENDING = 'FETCH_ORCID_ID_PENDING',
    FETCH_ORCID_SUCCESS = 'FETCH_ORCID_ID_SUCCESS',
    FETCH_ORCID_ERROR = 'FETCH_ORCID_ID_ERROR'

}

// PROFILE

export interface FetchProfileNone {
    type: ActionTypes.FETCH_PROFILE_NONE
}

export interface FetchProfileFetching {
    type: ActionTypes.FETCH_PROFILE_FETCHING
}

export interface FetchProfileSuccess {
    type: ActionTypes.FETCH_PROFILE_SUCCESS,
    profileView: ProfileView
}

export interface FetchProfileRefetching {
    type: ActionTypes.FETCH_PROFILE_REFETCHING
}

export interface FetchProfileError {
    type: ActionTypes.FETCH_PROFILE_ERROR,
    error: SimpleError
}

export type FetchProfileAction = FetchProfileNone | FetchProfileFetching | FetchProfileSuccess | FetchProfileRefetching | FetchProfileError;

// ORGS


export interface FetchOrgsNone {
    type: ActionTypes.FETCH_ORGS_NONE
}

export interface FetchOrgsFetching {
    type: ActionTypes.FETCH_ORGS_FETCHING
}

export interface FetchOrgsSuccess {
    type: ActionTypes.FETCH_ORGS_SUCCESS,
    orgsView: OrgsView
}

export interface FetchOrgsRefetching {
    type: ActionTypes.FETCH_ORGS_REFETCHING,
    orgsView: OrgsView
}

export interface FetchOrgsError {
    type: ActionTypes.FETCH_ORGS_ERROR,
    error: SimpleError
}

export type FetchOrgsAction = FetchOrgsNone | FetchOrgsFetching | FetchOrgsSuccess | FetchOrgsRefetching | FetchOrgsError;

// NARRATIVE

export interface FetchNarrativesNone {
    type: ActionTypes.FETCH_NARRATIVES_NONE
}

export interface FetchNarrativesFetching {
    type: ActionTypes.FETCH_NARRATIVES_FETCHING
}

export interface FetchNarrativesSuccess {
    type: ActionTypes.FETCH_NARRATIVES_SUCCESS,
    narrativesView: NarrativesView
}

export interface FetchNarrativesError {
    type: ActionTypes.FETCH_NARRATIVES_ERROR,
    error: SimpleError
}

export type FetchNarrativesAction = FetchNarrativesNone | FetchNarrativesFetching | FetchNarrativesSuccess | FetchNarrativesError;

// ORCID 

export interface FetchORCIDIdNone {
    type: ActionTypes.FETCH_ORCID_NONE
}

export interface FetchORCIDIdPending {
    type: ActionTypes.FETCH_ORCID_PENDING
}

export interface FetchORCIDIdSuccess {
    type: ActionTypes.FETCH_ORCID_SUCCESS,
    orcidId: string | null
}

export interface FetchORCIDIdError {
    type: ActionTypes.FETCH_ORCID_ERROR,
    message: string
}

export type FetchORCIDIdAction = FetchORCIDIdNone | FetchORCIDIdPending | FetchORCIDIdSuccess | FetchORCIDIdError;
