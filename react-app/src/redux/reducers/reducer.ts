import { Action, Reducer } from 'redux';
import { baseReducer } from '@kbase/ui-components'; 
import { BaseStoreState } from '@kbase/ui-components'; 
import { StoreState } from '../interfaces';

const reducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: Action) => {
  const baseState = baseReducer(state as BaseStoreState, action);
  // if (baseState) {
  //   return baseState as StoreState;
  // }
  return baseState as StoreState;
};

export default reducer;