import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { makeBaseStoreState } from "@kbase/ui-lib";
import { StoreState } from './interfaces';
import rootReducer from "./reducers/index";
import { profileFetchStatuses } from './fetchStatuses';

// When app starts, this runs first to set the initial state.
export function makeInitialStoreState(): StoreState {
    const baseStoreState = makeBaseStoreState();
    
    return {
        ...baseStoreState,  
        narrativeState: {
            narrativeList: [],
            loading: true
        },
        profileView: { profileFetchStatus: profileFetchStatuses.NONE },
        orgState: {
            orgList: [],
            loading: true
        }
    };
}
export function createReduxStore() {
    return createStore(rootReducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
}