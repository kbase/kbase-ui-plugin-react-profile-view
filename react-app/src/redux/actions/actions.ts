import React from 'react';
import { OrgsAction, OrgProp, loadProfileAction, ProfileView } from '../interfaces';
import { profileActionTypes, orgsActionTypes } from './actionTypes';


// fetching profile data is initiated
export function fetchProfile(){ // put type!
    console.log('this is profile spinner setter')
    return {
        type: profileActionTypes.FETCH_PROFILE
    }
}

// fetching profile data was successful 
export function loadProfile(payload:ProfileView):loadProfileAction {
    return {
        type: profileActionTypes.FETCH_PROFILE_SUCCESS,
        payload
    }
}

// fetch profile failed
export function fetchErrorProfile() {
    return {
        type: profileActionTypes.FETCH_PROFILE_ERROR,
    }
}

// during mounting - render before componentDidMount
export function initialRenderProfile() { 
    return {
        type: profileActionTypes.INITIAL_RENDER_PROFILE,
    }
}

// fetching Orgs was successful 
export function loadOrgs(orgList: Array<OrgProp>, loading: boolean):OrgsAction {
    return {
        type: orgsActionTypes.FETCH_ORGS,
        payload: {
            orgList: orgList,
            loading: loading
        }
    }

}

// fetching orgs is initiated
export function fetchOrgs(){ // put type!
    console.log('this is org spinner setter') 
    return {
        type: orgsActionTypes.FETCH_ORGS
    }
    
}