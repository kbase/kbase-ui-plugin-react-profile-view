import { StoreState, loadProfileAction } from "../interfaces";
import { ActionTypes } from "../actions/actionTypes";
import { AsyncFetchStatus } from '../fetchStatuses';

export default function profileReducer(state: StoreState, action: loadProfileAction): StoreState {
    const payload = action.payload;
    switch (action.type) {
        case ActionTypes.FETCH_PROFILE_SUCCESS:
            return (
                {
                    ...state,
                    profileView: payload
                }
            );

        case ActionTypes.FETCH_PROFILE_ERROR:
            return {
                ...state,
                profileView: payload
            };

        case ActionTypes.FETCH_PROFILE:
            return {
                ...state,
                profileView: { profileFetchStatus: AsyncFetchStatus.FETCHING }
            };

        case ActionTypes.FETCH_PROFILE_REFETCHING:
            if (state.profileView.profileFetchStatus !== AsyncFetchStatus.SUCCESS) {
                return state;
            }
            return {
                ...state,
                profileView: {
                    ...state.profileView,
                    profileFetchStatus: AsyncFetchStatus.REFETCHING
                }
            };

        case ActionTypes.FETCH_PROFILE_NONE:
            return {
                ...state,
                profileView: { profileFetchStatus: AsyncFetchStatus.NONE }
            };

        default:
            return state;
    };
};
