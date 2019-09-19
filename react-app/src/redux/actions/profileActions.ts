import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { sendTitle } from '@kbase/ui-lib';
import { fetchProfileAPI, updateProfileAPI } from '../../util/API';
import { StoreState, UserProfileService, ProfileView,  ProfileData} from "../interfaces";
import { fetchProfile, loadProfile, fetchErrorProfile } from './actionCreators';
import { profileFetchStatuses } from '../fetchStatuses';

/**
 * fetch user profile
 *  @param {string} id  profile ID
 */
export function getProfile(profileID:string) {
    return async function (dispatch:ThunkDispatch<StoreState, void, AnyAction>, getState:() => StoreState ) {
        // set the life cycle state to "fetching"
        dispatch(fetchProfile())
        
        const rootStore = getState();
        if(rootStore.auth.userAuthorization !== null) {
            const token = rootStore.auth.userAuthorization.token;
            const baseURL = rootStore.app.config.baseUrl;
            let payload:ProfileView;
            let response:UserProfileService  | Array<string> = await fetchProfileAPI(profileID, token, baseURL);
            console.log('getProfile', response);
            if (typeof response !== 'undefined' && !Array.isArray(response)) {
                if (response.user.username !== rootStore.auth.userAuthorization.username) {
                    dispatch(sendTitle('User Profile for ' + response.user.realname));
                }
                // shape response to profile before dispatch 
                payload = {
                    userName: {
                        userID: response.user.username,
                        name: response.user.realname
                    },
                    profileData: response.profile.userdata,
                    gravatarHash: response.profile.synced.gravatarHash,
                    profileFetchStatus: profileFetchStatuses.SUCCESS
                }
                dispatch(loadProfile(payload));
            } else if (Array.isArray(response)){
                //  set "profileIsFetching" to "error"
                dispatch(fetchErrorProfile());
            }
        }
    }
}


/**
 * set the spinner with fetchProfile action,
 * then call updateProfileAPI.
 * when the repose is good, update the profile with getProfile 
 * @param profileID 
 * @param userdata 
 */

//TODO: change baseURL back to const
export function updateProfile(profileID:string, userdata:ProfileData) {
    return async function (dispatch:ThunkDispatch<StoreState, void, AnyAction>, getState:() => StoreState ) {
        dispatch(fetchProfile())
        const rootStore = getState();
        if(rootStore.auth.userAuthorization !== null) {
            const token = rootStore.auth.userAuthorization.token;
            let baseURL = rootStore.app.config.baseUrl;
            baseURL = 'https://ci.kbase.us';
            let response = await updateProfileAPI(token, baseURL, userdata);
            console.log("update response", response)
            if(response === 200) {
                dispatch(getProfile(profileID))
            } else {
                dispatch(fetchErrorProfile());
            }
        }

    }
}