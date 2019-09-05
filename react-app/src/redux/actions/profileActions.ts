import { ThunkDispatch } from 'redux-thunk';
import { StoreState, UserProfileService, ProfileView } from "../interfaces";
import { AnyAction } from 'redux';
import { fetchProfileAPI, updateProfileAPI } from '../../util/API';
import { sendTitle } from '@kbase/ui-lib';
import { fetchProfile, loadProfile, fetchErrorProfile } from './actionCreators';
import { profileFetchStatuses } from '../fetchStatuses';

/**
 * fetch user profile
 *  @param {string} id  profile ID
 */
export function getProfile(profileID:string) {
    
    return async function (dispatch:ThunkDispatch<StoreState, void, AnyAction>, getState:() => StoreState ) {
        // set the life cycle state "profileIsFetching" to "fetching"
        dispatch(fetchProfile())

        const rootStore = getState();
        if(rootStore.auth.userAuthorization !== null) {
            const token = rootStore.auth.userAuthorization.token;
            const baseURL = rootStore.app.config.baseUrl;
            let payload:ProfileView;
            let response:UserProfileService = await fetchProfileAPI(profileID, token, baseURL);
            if (typeof response !== 'undefined') {
                if (response.user.username !== rootStore.auth.userAuthorization.username) {
                    dispatch(sendTitle('User Profile for ' + response.user.realname));
                }
                // shape response to profile before dispatch 
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
                    gravatarHash: response.profile.synced.gravatarHash,
                    profileFetchStatus: profileFetchStatuses.SUCCESS
                }
                dispatch(loadProfile(payload));
            } else {
                //  set "profileIsFetching" to "error"
                dispatch(fetchErrorProfile());
            }
        }
    }
}

export function updateProfile(profile:any) {
    return async function (dispatch:ThunkDispatch<StoreState, void, AnyAction> , getState:() => StoreState ) {
        dispatch(fetchProfile())
        const rootStore = getState();
        if(rootStore.auth.userAuthorization !== null) {
            const token = rootStore.auth.userAuthorization.token;
            const baseURL = rootStore.app.config.baseUrl;
            updateProfileAPI(token, baseURL, profile);
        }
    }
}