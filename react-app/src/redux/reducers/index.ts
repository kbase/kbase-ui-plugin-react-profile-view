import { Action, Reducer } from 'redux';
import narrativeReducer from './narrative_reducers';
import profileReducer from './profile_reducers';
import reducer from './reducer';
import { StoreState, NarrativeActionType, ProfileActionType, OrgsActionType } from  "../interfaces";
import orgsReducer from './org_reducers';



//TODO:AKIYO convert this to combine reducers


const rootReducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: Action) => {

  // Inital combine state created by store is loaded first 
  const kbaseUIStore = reducer(state as StoreState, action);
  // if state doesn't load for whatever the reason possibly could be 
  if (!state) {
    console.log('return state ')
    return state // honestly I don't know what this returns
  }
  
  // when reducer is creating KbaseUIStore 
  if (kbaseUIStore) {
    return kbaseUIStore as StoreState;
  } 
  else {
      console.log('Reducer', state, action)
    // when actions from app needs specific reducers
    switch(action.type) {
        case "LOAD_NARRATIVES": 
            return narrativeReducer(state, action as NarrativeActionType);
        case "LOAD_PROFILE": 
            return profileReducer(state, action as ProfileActionType);
        case "LOAD_ORGS":
            return orgsReducer(state, action as OrgsActionType);
        
      default:
        return state;
    }
  }
}


export default rootReducer;
