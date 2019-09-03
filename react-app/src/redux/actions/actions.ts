import React from 'react';
import { OrgsAction, OrgProp, ProfileAction, UserProfileService } from '../interfaces';
import { profileActionTypes } from './actionTypes';


const LOAD_ORGS = 'LOAD_ORGS';



export function loadOrgs(orgList: Array<OrgProp>, loading: boolean):OrgsAction {
    return {
        type: LOAD_ORGS,
        payload: {
            orgList: orgList,
            loading: loading
        }
    }

}

export function loadProfile(payload:any):ProfileAction {
// export function loadProfile(payload:UserProfileService):ProfileAction {
    return {
        type: profileActionTypes.LOAD_PROFILE,
        payload
    }
}

export function fetchProfile(){
    console.log('this is spinner setter')
    return {
        type: profileActionTypes.FETCH_PROFILE
    }
}