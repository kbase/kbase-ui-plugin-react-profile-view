import { StoreState, loadProfileAction } from "../interfaces";
import { profileActionTypes } from "../actions/actionTypes";
import { profileFetchStatuses } from '../fetchStatuses';

export default function profileReducer(state:StoreState, action: loadProfileAction): StoreState {
    const payload = action.payload;
    switch (action.type) {
        case profileActionTypes.FETCH_PROFILE_SUCCESS:
            return (
                {
                    ...state,
                    profileView: payload
                }
            );
                
        case profileActionTypes.FETCH_PROFILE_ERROR:
            return {
                ... state,
                profileView: payload
            };

        case profileActionTypes.FETCH_PROFILE:
            return {
                ... state,
                profileView: { profileFetchStatus: profileFetchStatuses.FETCHING }
            };

        case profileActionTypes.FETCH_PROFILE_NONE:
            return {
                ...state,
                profileView: { profileFetchStatus: profileFetchStatuses.NONE }
            };

        default:
            return state;
    };

};