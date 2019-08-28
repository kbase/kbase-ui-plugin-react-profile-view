import { ThunkDispatch } from 'redux-thunk';
import { StoreState, UserProfileService } from "../interfaces";
import { AnyAction } from 'redux';
import { fetchProfileAPI, updateProfileAPI } from '../../util/API';
import { sendTitle } from '@kbase/ui-lib';

const LOAD_PROFILE = 'LOAD_PROFILE';

/**
 * fetch user profile
 *  @param {string} id  profile ID
 */
export function loadProfile(profileID:string) {
    return async function (dispatch:ThunkDispatch<StoreState, void, AnyAction>, getState:() => StoreState ) {
        const rootStore = getState();
        if(rootStore.auth.userAuthorization !== null) {
            const token = rootStore.auth.userAuthorization.token;
            const baseURL = rootStore.app.config.baseUrl;
            let payload:any;
            let response:UserProfileService = await fetchProfileAPI(profileID, token, baseURL);
            if (typeof response !== 'undefined') {
                console.log("in profileAction loadProfile", response)
                if (response.user.username !== rootStore.auth.userAuthorization.username) {
                    dispatch(sendTitle('User Profile for ' + response.user.realname));
                }
                // // shape response to profile before dispatch 
                // TODO: Should this be in reduce? 
                payload = {
                    userName: {
                        userID: response.user.username,
                        name: response.user.realname
                    },
                    profileData: {
                        organization: response.profile.userdata.organization,
                        department: response.profile.userdata.department,
                        city: response.profile.userdata.city,
                        state: response.profile.userdata.state,
                        postalCode: response.profile.userdata.postalCode,
                        country: response.profile.userdata.country,
                        affiliations: response.profile.userdata.affiliations,
                        researchStatement: response.profile.userdata.researchStatement,
                        jobTitle: response.profile.userdata.jobTitle,
                        jobTitleOther: response.profile.userdata.jobTitleOther,
                        researchInterests: response.profile.userdata.researchInterests,
                        fundingSource: response.profile.userdata.fundingSource,
                        gravatarDefault: response.profile.userdata.gravatarDefault,
                        avatarOption: response.profile.userdata.avatarOption
                    },
                    gravatarHash: response.profile.synced.gravatarHash
                }
            } else {
                payload = {
                    userName: {
                        name: 'Something went wrong. Please check console for error messages..',
                        userID: ''
                    }
                }
            }
            
            dispatch({ type: LOAD_PROFILE, payload: payload});

        }
    }
}

export function updateProfile(profile:any) {
    return async function (dispatch:ThunkDispatch<StoreState, void, AnyAction> , getState:() => StoreState ) {
        const rootStore = getState();
        if(rootStore.auth.userAuthorization !== null) {
            const token = rootStore.auth.userAuthorization.token;
            const baseURL = rootStore.app.config.baseUrl;
            updateProfileAPI(token, baseURL, profile);
        }
    }
}