import React from 'react';
import { OrgAction, OrgList, loadProfileAction, ProfileView, ErrorMessages, OrgFetchError } from '../interfaces';
import { profileActionTypes, orgsActionTypes } from './actionTypes';


// fetching profile data is initiated
export function fetchProfile() { // put type!
    return {
        type: profileActionTypes.FETCH_PROFILE
    };
};

// fetching profile data was successful 
export function loadProfile(payload: ProfileView): loadProfileAction {
    return {
        type: profileActionTypes.FETCH_PROFILE_SUCCESS,
        payload
    };
};

// fetch profile failed
export function fetchErrorProfile(payload: ErrorMessages){
    return {
        type: profileActionTypes.FETCH_PROFILE_ERROR,
        payload
    };
};

// during mounting - render before componentDidMount
export function initialRenderProfile() {
    return {
        type: profileActionTypes.FETCH_PROFILE_NONE,
    };
};


// fetching Orgs was successful 
export function loadOrgs(payload: OrgList): OrgAction {
    return {
        type: orgsActionTypes.FETCH_ORGS_SUCCESS,
        payload
    };
};

// fetching orgs is initiated
export function fetchOrgs() {
    return {
        type: orgsActionTypes.FETCH_ORGS
    };
};

// fetch orgs failed
export function fetchErrorOrgs(payload:OrgFetchError):OrgAction {

    return {
        type: orgsActionTypes.FETCH_ORGS_ERROR,
        payload
    };
};

// during mounting - render before componentDidMount
export function initialRenderOrgs() {
    return {
        type: orgsActionTypes.FETCH_ORGS_NONE,
    };
};
