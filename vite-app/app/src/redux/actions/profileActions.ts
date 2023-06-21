import { sendTitle } from "@kbase/ui-components";
import { AuthenticationStatus } from "@kbase/ui-lib";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { JSONArray, JSONObject, JSONValue } from "../../types";
import { fetchProfileAPI, updateProfileAPI } from "../../util/API";
import { AsyncFetchStatus } from "../fetchStatuses";
import {
    ErrorMessages,
    ProfileUserdata,
    ProfileView,
    StoreState,
    UserName,
    UserProfileService,
} from "../interfaces";
import {
    fetchErrorProfile,
    fetchProfile,
    loadProfile,
    refetchProfile,
} from "./actionCreators";

function isJSONObject(value: JSONValue): value is JSONObject {
    if (typeof value === "string") {
        return false;
    }
    if (typeof value === "boolean") {
        return false;
    }
    if (typeof value === "number") {
        return false;
    }
    if (value === null) {
        return false;
    }
    if (value instanceof Array) {
        return false;
    }

    return true;
}

function isJSONArray(value: JSONValue): value is JSONArray {
    if (value instanceof Array) {
        return true;
    }

    return false;
}

function checkField(obj: JSONObject, name: string, type: string) {
    const value = obj[name];
    if (typeof value !== type) {
        return false;
    }
    return true;
}

function hasOwnProperty(value: JSONObject, property: string): boolean {
    return (Object.prototype.hasOwnProperty.call(value, property))
}

function fixProfile(possibleProfile: JSONValue): UserProfileService {
    if (!isJSONObject(possibleProfile)) {
        throw new Error("User profile is not an object");
    }

    if (!hasOwnProperty(possibleProfile, 'user')) {
        throw new Error('User profile missing "user" property');
    }

    if (hasOwnProperty(possibleProfile, "profile")) {
        throw new Error('User profile missing "profile" property');
    }

    const profile = possibleProfile["profile"];

    if (!isJSONObject(profile)) {
        throw new Error('User profile "profile" is not an object');
    }

    if (!hasOwnProperty(profile, "userdata")) {
        throw new Error('User profile missing "userdata" property');
    }
    const userdata = profile["userdata"];
    if (!isJSONObject(userdata)) {
        throw new Error('User profile "userdata" is not an object');
    }

    if (hasOwnProperty(userdata, "affiliations")) {
        const affiliations = userdata["affiliations"];
        if (!isJSONArray(affiliations)) {
            throw new Error('User profile "affiliations" is not an array');
        }
        const fixedAffiliations = affiliations.map((affiliation) => {
            if (!isJSONObject(affiliation)) {
                throw new Error('User profile "affiliation" is not an object');
            }
            // Check fields.
            checkField(affiliation, "title", "string");
            checkField(affiliation, "organization", "string");

            if (!checkField(affiliation, "started", "number")) {
                const possibleStarted = affiliation["started"];
                if (typeof possibleStarted === "string") {
                    const started = parseInt(possibleStarted);
                    if (isNaN(started)) {
                        console.error("Invalid started year in profile", affiliation);
                        // throw new Error('affiliation "started" year is not a number or compatible string');
                        return null;
                    } else {
                        affiliation["started"] = started;
                    }
                } else {
                    console.error("Invalid started year in profile", affiliation);
                    return null;
                    // throw new Error('affiliation "started" year is not a number or string');
                }
            }
            if (
                !(checkField(affiliation, "ended", "number") ||
                    (checkField(affiliation, "ended", "object") &&
                        affiliation["ended"] === null))
            ) {
                const possibleEnded = affiliation["ended"];
                if (typeof possibleEnded === "string") {
                    if (possibleEnded === "") {
                        // console.warn('dropping affiliation')
                        // delete affiliation['ended'];
                        affiliation["ended"] = null;
                    } else {
                        const ended = parseInt(possibleEnded);
                        if (isNaN(ended)) {
                            affiliation["ended"] = null;
                            // console.error('Invalid ended year in profile', affiliation);
                            // return null;
                            // throw new Error('affiliation "ended" is not a number or compatible string');
                        } else {
                            affiliation["ended"] = ended;
                        }
                    }
                } else {
                    console.warn(
                        `Invalid ended year in profile, expected number or string, got ${typeof possibleEnded}`,
                        possibleEnded,
                    );
                    return null;
                    // throw new Error('affiliation "ended" year is not a number or string');
                }
            }
            return affiliation;
        }).filter((affiliation) => {
            return affiliation === null ? false : true;
        });
        userdata.affiliations = fixedAffiliations;
    }

    return (possibleProfile as unknown) as UserProfileService;
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
        dispatch(fetchProfile());

        const rootStore = getState();

        const {
            authentication,
            app: {
                config: {
                    services: {
                        ServiceWizard: {
                            url: serviceWizardURL,
                        },
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
            const response: UserProfileService = fixProfile(
                await fetchProfileAPI(username, token, serviceWizardURL),
            );
            let profileEdit: boolean;
            if (response.user.username !== authUsername) {
                dispatch(sendTitle("User Profile for " + response.user.realname));
                profileEdit = false;
            } else {
                profileEdit = true;
            }
            // shape response to profile before dispatch
            // TODO: preserve profile structure; the fetched profile is, of course, already
            // in the profile shape; we are creating a view model here, which, unfortunately,
            // dissects the profile for no good reason I can see. A few model is free to do this,
            // of course, but it needs a good reason. E.g. raw values may need to be wrapped in a
            // field, to control field state. Even then, you probably want to preserve the
            // original raw data as well.
            const payload: ProfileView = {
                userName: {
                    userID: response.user.username,
                    name: response.user.realname,
                },
                editEnable: profileEdit,
                profileUserdata: response.profile.userdata,
                gravatarHash: response.profile.synced.gravatarHash,
                profileFetchStatus: AsyncFetchStatus.SUCCESS,
            };
            dispatch(loadProfile(payload));
        } catch (ex) {
            console.error("ERROR fetching profile", ex);
            dispatch(fetchErrorProfile({
                errorMessages: [ex instanceof Error ? ex.message : "Unknown error"],
                profileFetchStatus: AsyncFetchStatus.ERROR,
            }));
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

export function updateProfile(userdata: ProfileUserdata) {
    return async function (
        dispatch: ThunkDispatch<StoreState, void, AnyAction>,
        getState: () => StoreState,
    ) {
        dispatch(refetchProfile());
        const rootStore = getState();

        const {
            authentication,
            app: {
                config: {
                    services: {
                        UserProfile: {
                            url: userProfileServiceURL,
                        },
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
                username,
                realname,
            },
        } = authentication;

        // TODO: better is to fetch the profile first, with just the username,
        // the take the 'user' property for the update.
        // const token = rootStore.auth.userAuthorization.token;
        // let url = rootStore.app.config.services.UserProfile.url;
        const user: UserName = {
            userID: username,
            name: realname,
        };

        // TODO: NO NO NO - don't expose the http response code here. All we need
        // to do is handle an exception.
        const response = await updateProfileAPI(
            token,
            userProfileServiceURL,
            userdata,
            user,
        );
        if (response === 200) {
            // dispatch(getProfile(username));
        } else {
            if (Array.isArray(response)) {
                const errorPayload: ErrorMessages = {
                    errorMessages: response,
                    profileFetchStatus: AsyncFetchStatus.ERROR,
                };
                dispatch(fetchErrorProfile(errorPayload));
            }
        }
    };
}
