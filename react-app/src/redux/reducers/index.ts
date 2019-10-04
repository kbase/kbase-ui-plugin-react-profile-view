import { Action, Reducer } from 'redux';
import narrativeReducer from './narrative_reducers';
import profileReducer from './profile_reducers';
import reducer from './reducer';
import { StoreState, NarrativeAction, loadProfileAction, loadOrgAction } from  "../interfaces";
import { profileActionTypes, orgsActionTypes, narrativeActionTypes } from '../actions/actionTypes';
import orgsReducer from './org_reducers';



//TODO: convert this to combine reducers


const rootReducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: Action) => {
  // Inital combine state created by store is loaded first 
  const kbaseUIStore = reducer(state as StoreState, action);
  // if state doesn't load for whatever the reason possibly could be 
  if (!state) {
    // TODO: AKIYO - return intial state 
    return state;
  }
  
  // root reducer is creating KbaseUIStore 
  if (kbaseUIStore) {
    return kbaseUIStore as StoreState;
  } 
  else {
    switch(action.type) {
        case narrativeActionTypes.FETCH_NARRATIVE: 
        case narrativeActionTypes.FETCH_NARRATIVE_NONE: 
        case narrativeActionTypes.FETCH_NARRATIVE_SUCCESS: 
        case narrativeActionTypes.FETCH_NARRATIVE_ERROR: 
            return narrativeReducer(state, action as NarrativeAction);
        case profileActionTypes.FETCH_PROFILE: 
        case profileActionTypes.FETCH_PROFILE_NONE: 
        case profileActionTypes.FETCH_PROFILE_SUCCESS: 
        case profileActionTypes.FETCH_PROFILE_ERROR: 
            return profileReducer(state, action as loadProfileAction);
        case orgsActionTypes.FETCH_ORGS:
        case orgsActionTypes.FETCH_ORGS_NONE:
        case orgsActionTypes.FETCH_ORGS_SUCCESS:
        case orgsActionTypes.FETCH_ORGS_ERROR:
            return orgsReducer(state, action as loadOrgAction);
        
      default:
        return state;
    };
  };
};


export default rootReducer;
