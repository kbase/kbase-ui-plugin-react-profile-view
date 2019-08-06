import { Action, Reducer, combineReducers } from 'redux';
import narrativeReducer from './narrative_reducers';
import reducer from './reducer';
import { StoreState } from "../store";


const fooReducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: Action) => {
  const fooState = reducer(state as StoreState, action);
  if (fooState) {
    console.log('return foo state ')
    return fooState as StoreState;
  } 
  if (!state) {
    console.log('return state ')
   return state }
  else {
    console.log('calling narrative Reducer', action)
    return narrativeReducer(state, action) ;
  }
}
// const reactAppReducer = combineReducers({
  
//   narrativeReducer
// })

export default fooReducer;

/**
 * import { combineReducers } from 'redux'
import * as reducers from './reducers'

const todoApp = combineReducers(reducers)
 */