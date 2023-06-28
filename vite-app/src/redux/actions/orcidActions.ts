// ORCID Id 

import { AnyAction } from "redux";
import { StoreState } from "../interfaces";
import { ActionTypes, FetchORCIDIdError, FetchORCIDIdNone, FetchORCIDIdPending, FetchORCIDIdSuccess } from "./actionTypes";

import { AuthenticationStatus } from "@kbase/ui-lib";
import { ThunkDispatch } from "redux-thunk";
import { SERVICE_CALL_TIMEOUT } from "../../constants";
import { ORCIDLinkServiceClient } from "../../util/ORCIDLink/Client";
import { ClientError } from "../../util/ORCIDLink/ServiceClient";


export function fetchORCIDIdNone(): FetchORCIDIdNone {
    return {
        type: ActionTypes.FETCH_ORCID_NONE
    }
}

export function fetchORCIDIdPending(): FetchORCIDIdPending {
    return {
        type: ActionTypes.FETCH_ORCID_PENDING,
    }
}

export function fetchORCIDIdSuccess(orcidId: string | null): FetchORCIDIdSuccess {
    return {
        type: ActionTypes.FETCH_ORCID_SUCCESS,
        orcidId
    }
}

export function fetchORCIDIdError(message: string): FetchORCIDIdError {
    return {
        type: ActionTypes.FETCH_ORCID_ERROR,
        message
    }
}

export function fetchORCIDId(username: string) {
    // ThunkDispatch<RootState(Store), ExtraArg, Action>;
    return async function (dispatch: ThunkDispatch<StoreState, void, AnyAction>, getState: () => StoreState) {
        const rootStore = getState();

        dispatch(fetchORCIDIdPending());

        const {
            authentication,
            // TODO: Add the orcid link service to the ui-lib
            app: {
                config: {
                    // baseUrl,
                    services: {
                        UserProfile: {
                            url: userProfileURL
                        }
                    }
                }
            }
        } = rootStore;

        if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
            throw new Error('Not authorized');
        }

        const {
            userAuthentication: {
                token
            }
        } = authentication;

        // Construct a url to the orcidlink service
        // TODO: fix baseURL - to match kbase-ui config ??
        // TODO: orcidlink to the kbase-ui-lib
        //
        // const url = new URL(baseUrl);
        const match = /^(.*\/\/[^/]+)\/services/.exec(userProfileURL);
        if (match === null) {
            dispatch(fetchORCIDIdError('Cannot get baseURL'));
            return;
        }
        const [, baseURL] = match;
        const url = new URL(baseURL);
        url.pathname = '/services/orcidlink';

        try {
            const { orcidId } = await new ORCIDLinkServiceClient({
                url: url.toString(),
                timeout: SERVICE_CALL_TIMEOUT,
                token
            }).getLinkShare(username);
            dispatch(fetchORCIDIdSuccess(orcidId));
        } catch (ex) {
            if (ex instanceof ClientError) {
                if (ex.code === "notFound") {
                    dispatch(fetchORCIDIdSuccess(null));
                } else {
                    dispatch(fetchORCIDIdError(ex.message));
                }
            } else if (ex instanceof Error) {
                dispatch(fetchORCIDIdError(ex.message));
            } else {
                dispatch(fetchORCIDIdError('Unknown error'));
            }
        }
    }
}
