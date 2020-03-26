import { Action, Reducer } from 'redux';
import narrativeReducer from './narrative_reducers';
import profileReducer from './profile_reducers';
import reducer from './reducer';
import { StoreState, NarrativeAction, loadProfileAction } from "../interfaces";
import { ActionTypes } from '../actions/actionTypes';
import orgsReducer from './org_reducers';
import { OrgAction } from '../actions/orgActions';

//TODO: convert this to combine reducers

const rootReducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: Action) => {
    // Initial combine state created by store is loaded first 
    const kbaseUIStore = reducer(state as StoreState, action);
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
            case ActionTypes.FETCH_NARRATIVE:
            case ActionTypes.FETCH_NARRATIVE_NONE:
            case ActionTypes.FETCH_NARRATIVE_SUCCESS:
            case ActionTypes.FETCH_NARRATIVE_ERROR:
                return narrativeReducer(state, action as NarrativeAction);
            case ActionTypes.FETCH_PROFILE:
            case ActionTypes.FETCH_PROFILE_NONE:
            case ActionTypes.FETCH_PROFILE_SUCCESS:
            case ActionTypes.FETCH_PROFILE_ERROR:
                return profileReducer(state, action as loadProfileAction);
            case ActionTypes.FETCH_ORGS:
            case ActionTypes.FETCH_ORGS_NONE:
            case ActionTypes.FETCH_ORGS_SUCCESS:
            case ActionTypes.FETCH_ORGS_ERROR:
                return orgsReducer(state, action as OrgAction);

            default:
                return state;
        };
    };
};


export default rootReducer;
