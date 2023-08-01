import { ActionTypes, FetchOrgsAction } from '../actions/actionTypes';
import { AsyncFetchStatus } from '../asyncFetchState';
import { StoreState } from '../interfaces';

export default function orgsReducer(state: StoreState, action: FetchOrgsAction): StoreState {
    switch (action.type) {
        case ActionTypes.FETCH_ORGS_NONE:
            return (
                {
                    ...state,
                    orgsState: {
                        status: AsyncFetchStatus.NONE
                    }
                }
            );
        case ActionTypes.FETCH_ORGS_FETCHING:
            return (
                {
                    ...state,
                    orgsState: {
                        status: AsyncFetchStatus.FETCHING
                    }
                }
            );
        case ActionTypes.FETCH_ORGS_SUCCESS:
            return (
                {
                    ...state,
                    orgsState: {
                        status: AsyncFetchStatus.SUCCESS,
                        value: action.orgsView
                    }
                }
            );
        case ActionTypes.FETCH_ORGS_REFETCHING:
            return (
                {
                    ...state,
                    orgsState: {
                        status: AsyncFetchStatus.REFETCHING,
                        value: action.orgsView
                    }
                }
            );

        case ActionTypes.FETCH_ORGS_ERROR:
            return (
                {
                    ...state,
                    orgsState: {
                        status: AsyncFetchStatus.ERROR,
                        error: action.error
                    }
                }
            );

        default:
            return state;
    }
}