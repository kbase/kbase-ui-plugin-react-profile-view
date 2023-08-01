import { ActionTypes, FetchProfileAction } from "../actions/actionTypes";
import { AsyncFetchStatus } from '../asyncFetchState';
import { StoreState } from "../interfaces";

export default function profileReducer(state: StoreState, action: FetchProfileAction): StoreState {
    switch (action.type) {

        case ActionTypes.FETCH_PROFILE_NONE:
            return {
                ...state,
                profileState: { status: AsyncFetchStatus.NONE }
            };
        case ActionTypes.FETCH_PROFILE_FETCHING:
            return {
                ...state,
                profileState: { status: AsyncFetchStatus.FETCHING }
            };
        case ActionTypes.FETCH_PROFILE_SUCCESS:
            return (
                {
                    ...state,
                    profileState: {
                        status: AsyncFetchStatus.SUCCESS,
                        value: action.profileView
                    }
                }
            );

        case ActionTypes.FETCH_PROFILE_REFETCHING:
            if (state.profileState.status !== AsyncFetchStatus.SUCCESS) {
                console.warn('status must be SUCCESS of REFETCHING');
                return state;
            }
            return (
                {
                    ...state,
                    profileState: {
                        ...state.profileState,
                        status: AsyncFetchStatus.REFETCHING
                    }
                }
            );

        case ActionTypes.FETCH_PROFILE_ERROR:
            return {
                ...state,
                profileState: {
                    status: AsyncFetchStatus.ERROR,
                    error: action.error
                }
            };

        default:
            return state;
    }
}
