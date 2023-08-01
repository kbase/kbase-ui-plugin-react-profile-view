import { sendTitle } from "@kbase/ui-components";
import { AuthenticationStatus } from "@kbase/ui-lib";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { UserProfileUpdate, fetchProfileAPI2, updateProfileAPI } from "../../util/API";
import {
    ProfileView,
    StoreState
} from "../interfaces";
import {
    fetchProfileError, fetchProfileFetching,
    fetchProfileRefetching, fetchProfileSuccess
} from "./actionCreators";

export interface FetchProfileViewOptions {
    authUsername: string;
    username: string;
    token: string;
    serviceWizardURL: string;
    userProfileServiceURL: string;
}

export async function fetchProfileView({ authUsername, username, token, userProfileServiceURL }: FetchProfileViewOptions): Promise<[boolean, ProfileView]> {

    // const profile = await fetchProfileAPI(username, token, serviceWizardURL);
    const [profile, warnings] = await fetchProfileAPI2(username, token, userProfileServiceURL);
    const { user, profile: { userdata, preferences, synced: { gravatarHash } } } = profile;

    const isOwner = profile.user.username === authUsername;

    // shape response to profile before dispatch
    // TODO: preserve profile structure; the fetched profile is, of course, already
    // in the profile shape; we are creating a view model here, which, unfortunately,
    // dissects the profile for no good reason I can see. A few model is free to do this,
    // of course, but it needs a good reason. E.g. raw values may need to be wrapped in a
    // field, to control field state. Even then, you probably want to preserve the
    // original raw data as well.
    const profileView: ProfileView = {
        user,
        profile: { userdata, preferences, gravatarHash },
        editEnable: isOwner,
        warnings
    };

    return [isOwner, profileView];
}

/**
 * fetch user profile
 *  @param {string} id  profile ID
 */
export function getProfile(username: string) {
    return async function (
        dispatch: ThunkDispatch<StoreState, void, AnyAction>,
        getState: () => StoreState,
    ) {
        // set the life cycle state to "fetching"
        dispatch(fetchProfileFetching());

        const rootStore = getState();

        const {
            authentication,
            app: {
                config: {
                    services: {
                        ServiceWizard: {
                            url: serviceWizardURL,
                        },
                        UserProfile: {
                            url: userProfileServiceURL
                        }
                    },
                },
            },
        } = rootStore;

        if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
            console.error("Not authenticated");
            return;
        }

        const {
            userAuthentication: {
                token,
                username: authUsername,
            },
        } = authentication;

        try {

            const [isOwner, profileView] = await fetchProfileView({ authUsername, username, token, serviceWizardURL, userProfileServiceURL });

            if (!isOwner) {
                dispatch(sendTitle(`User Profile for ${profileView.user.realname}`));
            }

            dispatch(fetchProfileSuccess(profileView));
        } catch (ex) {
            const message = ex instanceof Error ? ex.message : "Unknown error";
            dispatch(fetchProfileError({ message }))
        }
    };
}

/**
 * set the spinner with fetchProfile action,
 * then call updateProfileAPI.
 * when the response is good, update the profile with getProfile
 * @param userName
 * @param userdata
 */

export function updateProfile(updatedProfile: UserProfileUpdate) {
    return async function (
        dispatch: ThunkDispatch<StoreState, void, AnyAction>,
        getState: () => StoreState,
    ) {
        dispatch(fetchProfileRefetching());
        const rootStore = getState();

        const {
            authentication,
            app: {
                config: {
                    services: {
                        UserProfile: {
                            url: userProfileServiceURL,
                        },
                        ServiceWizard: {
                            url: serviceWizardURL
                        }
                    },
                },
            },
        } = rootStore;

        if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
            console.error("Not authenticated");
            return;
        }

        const {
            userAuthentication: {
                token,
                username
            },
        } = authentication;

        // TODO: better is to fetch the profile first, with just the username,
        // the take the 'user' property for the update.
        // const token = rootStore.auth.userAuthorization.token;
        // let url = rootStore.app.config.services.UserProfile.url;

        // TODO: do we really need to send these?
        // const userName: UserProfile = {
        //     userID: username,
        //     name: realname,
        // };

        // TODO: NO NO NO - don't expose the http response code here. All we need
        // to do is handle an exception.
        const [status, message] = await updateProfileAPI(
            token,
            userProfileServiceURL,
            updatedProfile
        );

        // A bit ugly. To fulfill the concept of "refetching", we need to repopulate
        // the profileView.
        // We probably should
        // const payload: ProfileView = {
        //     userName,
        //     editEnable: true,
        //     profileUserdata,
        //     gravatarHash: response.profile.synced.gravatarHash
        // };

        if (status === 200) {
            // dispatch(getProfile(username));
            const [, profile] = await fetchProfileView({ authUsername: username, username, token, serviceWizardURL, userProfileServiceURL });

            dispatch(fetchProfileSuccess(profile))
        } else {
            dispatch(fetchProfileError({ message: `${message} (${status})` }))
        }
    };
}
