import { ActionTypes } from '../actions/actionTypes';
import { OrgAction } from '../actions/orgActions';
import { AsyncFetchStatus } from '../fetchStatuses';
import { StoreState } from '../interfaces';

export default function orgsReducer(state: StoreState, action: OrgAction): StoreState {
    switch (action.type) {
        case ActionTypes.FETCH_ORGS_SUCCESS:
            return (
                {
                    ...state,
                    orgState: action.payload
                }
            );
        case ActionTypes.FETCH_ORGS_REFETCHING:
            return (
                {
                    ...state,
                    orgState: action.payload
                }
            );
        case ActionTypes.FETCH_ORGS_FETCHING:
            return (
                {
                    ...state,
                    orgState: {
                        orgFetchStatus: AsyncFetchStatus.FETCHING
                    }
                }
            );
        case ActionTypes.FETCH_ORGS_ERROR:
            return (
                {
                    ...state,
                    orgState: action.payload
                }
            );
        case ActionTypes.FETCH_ORGS_NONE:
            return (
                {
                    ...state,
                    orgState: {
                        orgFetchStatus: AsyncFetchStatus.NONE
                    }
                }
            );
        default:
            return state;
    }
}