import { BaseStoreState, makeBaseStoreState } from "@kbase/ui-lib";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducer";

export interface StoreState extends BaseStoreState {}

export function makeInitialStoreState(): StoreState {
  const baseStoreState = makeBaseStoreState();
  return {
    ...baseStoreState
  };
}

export function createReduxStore() {
  return createStore(reducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
}