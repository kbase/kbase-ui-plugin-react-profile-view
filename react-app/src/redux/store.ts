import { BaseStoreState, makeBaseStoreState } from "@kbase/ui-lib";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { NarrativeData } from '../pages/Home';
import rootReducer from "./reducers/index";


interface NarrativeState {
        narrativeDataArray: Array<NarrativeData>; 
}
// export interface StoreState extends BaseStoreState,  ReactAppState{ }
export interface StoreState extends BaseStoreState,  NarrativeState {}

// When app starts, this runs first to set the initial state.
export function makeInitialStoreState(): StoreState {
    const baseStoreState = makeBaseStoreState();
    // setting initial empty narrative state
    const narrativePreloadedState: Array<NarrativeData>  = [{
        wsID: '',
        permission: '',
        name: '',
        last_saved: 0,
        users: {},
        narrative_detail: { creator: '' }
    }]
    console.log('baseStoreState', baseStoreState)
    return {
        // ...baseStoreState, userProfileApp:{ narrativeDataArray: narrativePreloadedState }
        ...baseStoreState,  narrativeDataArray: narrativePreloadedState 
    };
}
export function createReduxStore() {
    return createStore(rootReducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
}