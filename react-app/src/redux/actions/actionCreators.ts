import {
    OrgList, loadProfileAction, ProfileView, ErrorMessages, OrgFetchError
} from '../interfaces';
import { ActionTypes } from './actionTypes';
import { OrgAction, OrgActionError } from './orgActions';


// fetching profile data is initiated
export function fetchProfile() {
    return {
        type: ActionTypes.FETCH_PROFILE
    };
};

export function refetchProfile() {
    return {
        type: ActionTypes.FETCH_PROFILE_REFETCHING
    };
};

// fetching profile data was successful 
export function loadProfile(payload: ProfileView): loadProfileAction {
    return {
        type: ActionTypes.FETCH_PROFILE_SUCCESS,
        payload
    };
};

// fetch profile failed
export function fetchErrorProfile(payload: ErrorMessages) {
    return {
        type: ActionTypes.FETCH_PROFILE_ERROR,
        payload
    };
};

// during mounting - render before componentDidMount
export function fetchProfileNone() {
    return {
        type: ActionTypes.FETCH_PROFILE_NONE,
    };
};


// fetching Orgs was successful 
export function loadOrgs(payload: OrgList): OrgAction {
    return {
        type: ActionTypes.FETCH_ORGS_SUCCESS,
        payload
    };
};

// fetching orgs is initiated
export function fetchOrgs() {
    return {
        type: ActionTypes.FETCH_ORGS
    };
};

// fetch orgs failed
export function fetchErrorOrgs(payload: OrgFetchError): OrgActionError {
    return {
        type: ActionTypes.FETCH_ORGS_ERROR,
        payload
    };
};

// during mounting - render before componentDidMount
export function initialRenderOrgs() {
    return {
        type: ActionTypes.FETCH_ORGS_NONE,
    };
};
