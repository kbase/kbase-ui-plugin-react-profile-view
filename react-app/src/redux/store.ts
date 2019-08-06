import { BaseStoreState, makeBaseStoreState } from "@kbase/ui-lib";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { NarrativeData } from '../pages/Home';
import reducer from "./reducers/reducer";
import reactAppReducer from "./reducers/index";

interface ReactAppState {
    userProfileApp: {
        narrativeDataArray: Array<NarrativeData>; 
    }
}
interface NarrativeState {
        narrativeDataArray: Array<NarrativeData>; 
}
// export interface StoreState extends BaseStoreState,  ReactAppState{ }
export interface StoreState extends BaseStoreState,  NarrativeState {}


export function makeInitialStoreState(): StoreState {
    const baseStoreState = makeBaseStoreState();
    const narrativePreloadedState: Array<NarrativeData>  = [{
        wsID: '',
        permission: '',
        name: '',
        last_saved: 0,
        users: {},
        narrative_detail: { creator: 'me' }
    }]
    console.log('baseStoreState', baseStoreState)
    return {
        // ...baseStoreState, userProfileApp:{ narrativeDataArray: narrativePreloadedState }
        ...baseStoreState,  narrativeDataArray: narrativePreloadedState 
    };
}
console.log('makeInitialStoreState', makeInitialStoreState())
export function createReduxStore() {
    return createStore(reactAppReducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
}