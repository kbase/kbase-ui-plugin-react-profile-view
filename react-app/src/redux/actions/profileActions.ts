import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { sendTitle } from '@kbase/ui-components';
import { fetchProfileAPI, updateProfileAPI } from '../../util/API';
import { StoreState, UserProfileService, ProfileView,  ProfileData, ErrorMessages, UserName} from "../interfaces";
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
            let response:UserProfileService  | Array<number|string> = await fetchProfileAPI(profileID, token, baseURL);
            let profileEdit:boolean;
            if (typeof response !== 'undefined' && !Array.isArray(response)) {
                let responseData = response as UserProfileService;
                if (responseData.user.username !== rootStore.auth.userAuthorization.username) {
                    dispatch(sendTitle('User Profile for ' + responseData.user.realname));
                    profileEdit = false;
                } else {
                    profileEdit = true;
                }
                // shape response to profile before dispatch 
                payload = {
                    userName: {
                        userID: responseData.user.username,
                        name: responseData.user.realname
                    },
                    editEnable: profileEdit,
                    profileData: responseData.profile.userdata,
                    gravatarHash: responseData.profile.synced.gravatarHash,
                    profileFetchStatus: profileFetchStatuses.SUCCESS
                }
                dispatch(loadProfile(payload));
            } else if (Array.isArray(response)){
                //  set "profileIsFetching" to "error"
                let errorPayload: ErrorMessages = {
                    errorMessages: response,
                    profileFetchStatus: profileFetchStatuses.ERROR
                }
                dispatch(fetchErrorProfile(errorPayload));
            } else {
                 console.log(response)  
            }
        } else {
            console.log('auth is null ', rootStore.auth.userAuthorization)
        }
    }
}


/**
 * set the spinner with fetchProfile action,
 * then call updateProfileAPI.
 * when the repose is good, update the profile with getProfile 
 * @param userName 
 * @param userdata 
 */

export function updateProfile(userdata:ProfileData, userName:UserName) {
    return async function (dispatch:ThunkDispatch<StoreState, void, AnyAction>, getState:() => StoreState ) {
        dispatch(fetchProfile())
        const rootStore = getState();
        if(rootStore.auth.userAuthorization !== null) {
            const token = rootStore.auth.userAuthorization.token;
            let baseURL = rootStore.app.config.baseUrl;
            // let user = {name: name, userID: profileID}
            let response = await updateProfileAPI(token, baseURL, userdata, userName);
            if(response === 200) {
                dispatch(getProfile(userName.userID))
            } else {
                if (Array.isArray(response)) {
                    let errorPayload: ErrorMessages = {
                        errorMessages: response,
                        profileFetchStatus: profileFetchStatuses.ERROR
                    }
                    dispatch(fetchErrorProfile(errorPayload));
                }
            }
        }

    }
}