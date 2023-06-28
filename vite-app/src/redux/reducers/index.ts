import { Action, Reducer } from 'redux';
import { ActionTypes, FetchNarrativesAction, FetchORCIDIdAction, FetchOrgsAction, FetchProfileAction } from '../actions/actionTypes';
import { StoreState } from "../interfaces";
import narrativeReducer from './narrative_reducers';
import orcidReducer from './orcidReducers';
import orgsReducer from './org_reducers';
import profileReducer from './profile_reducers';
import baseReducer from './reducer';

//TODO: convert this to combine reducers

const rootReducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: Action) => {
    // Initial combine state created by store is loaded first 
    const kbaseUIStore = baseReducer(state as StoreState, action);
    // if state doesn't load for whatever the reason possibly could be 
    if (!state) {
        return state;
    }

    // root reducer is creating KbaseUIStore 
    if (kbaseUIStore) {
        return kbaseUIStore as StoreState;
    }
    else {
        switch (action.type) {
            case ActionTypes.FETCH_NARRATIVES_NONE:
            case ActionTypes.FETCH_NARRATIVES_FETCHING:
            case ActionTypes.FETCH_NARRATIVES_SUCCESS:
            case ActionTypes.FETCH_NARRATIVES_ERROR:
                return narrativeReducer(state, action as FetchNarrativesAction);
            case ActionTypes.FETCH_PROFILE_NONE:
            case ActionTypes.FETCH_PROFILE_FETCHING:
            case ActionTypes.FETCH_PROFILE_REFETCHING:
            case ActionTypes.FETCH_PROFILE_SUCCESS:
            case ActionTypes.FETCH_PROFILE_ERROR:
                return profileReducer(state, action as FetchProfileAction);
            case ActionTypes.FETCH_ORGS_NONE:
            case ActionTypes.FETCH_ORGS_FETCHING:
            case ActionTypes.FETCH_ORGS_REFETCHING:
            case ActionTypes.FETCH_ORGS_SUCCESS:
            case ActionTypes.FETCH_ORGS_ERROR:
                return orgsReducer(state, action as FetchOrgsAction);
            case ActionTypes.FETCH_ORCID_NONE:
            case ActionTypes.FETCH_ORCID_PENDING:
            case ActionTypes.FETCH_ORCID_SUCCESS:
            case ActionTypes.FETCH_ORCID_ERROR:
                return orcidReducer(state, action as FetchORCIDIdAction);

            default:
                return state;
        }
    }
};


export default rootReducer;
