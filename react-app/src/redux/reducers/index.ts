import { Action, Reducer } from 'redux';
import narrativeReducer from './narrative_reducers';
import reducer from './reducer';
import { StoreState } from "../store";
import { NarrativeData } from "../../pages/Home";

interface narrativeFetchActionType {
  type: string;
  payload: Array<NarrativeData>
}
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
    // when actions from app needs specific reducers
    switch(action.type) {
      case "LOAD_NARRATIVES": 
        console.log('calling narrative Reducer', action)
        return narrativeReducer(state, action as narrativeFetchActionType) ;
      case "LOAD_MINE_NARRATIVES": 
        console.log('calling narrative Reducer', action)
        return narrativeReducer(state, action as narrativeFetchActionType) ;
      default:
        return state;
    }
  }
}


export default rootReducer;
