import { Action, Reducer } from 'redux';
import narrativeReducer from './narrative_reducers';
import profileReducer from './profile_reducers';
import reducer from './reducer';
import { StoreState, NarrativeAction, ProfileAction, OrgsAction } from  "../interfaces";
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
        case "LOAD_NARRATIVES": 
            return narrativeReducer(state, action as NarrativeAction);
        case "LOAD_PROFILE": 
            return profileReducer(state, action as ProfileAction);
        case "LOAD_ORGS":
            return orgsReducer(state, action as OrgsAction);
        
      default:
        return state;
    }
  }
}


export default rootReducer;
