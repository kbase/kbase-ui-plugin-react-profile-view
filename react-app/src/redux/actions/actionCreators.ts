import React from 'react';
import { loadOrgAction, OrgList, loadProfileAction, ProfileView, ProfileState } from '../interfaces';
import { profileActionTypes, orgsActionTypes } from './actionTypes';


// fetching profile data is initiated
export function fetchProfile() { // put type!
    console.log("fetch profile?")
    return {
        type: profileActionTypes.FETCH_PROFILE
    };
};

// fetching profile data was successful 
export function loadProfile(payload: ProfileView): loadProfileAction {
    console.log("loadProfile profile? payload", payload)

    return {
        type: profileActionTypes.FETCH_PROFILE_SUCCESS,
        payload
    };
};

// fetch profile failed
export function fetchErrorProfile() {
    return {
        type: profileActionTypes.FETCH_PROFILE_ERROR,
    };
};

// during mounting - render before componentDidMount
export function initialRenderProfile() {
    return {
        type: profileActionTypes.FETCH_PROFILE_NONE,
    };
};


// fetching Orgs was successful 
export function loadOrgs(payload: OrgList): loadOrgAction {
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
export function fetchErrorOrgs() {
    return {
        type: orgsActionTypes.FETCH_ORGS_ERROR,
    };
};

// during mounting - render before componentDidMount
export function initialRenderOrgs() {
    return {
        type: orgsActionTypes.FETCH_ORGS_NONE,
    };
};
