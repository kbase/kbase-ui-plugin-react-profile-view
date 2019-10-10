import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { makeBaseStoreState } from '@kbase/ui-components';
import { StoreState } from './interfaces';
import rootReducer from './reducers/index';
import { profileFetchStatuses, orgFetchStatuses } from './fetchStatuses';

// I think i need to use action creator initialRenderOrgs & initialRenderProfile instead

// When app starts, this runs first to set the initial state.
export function makeInitialStoreState(): StoreState {
    const baseStoreState = makeBaseStoreState();
    console.log(baseStoreState)
    return {
        ...baseStoreState,  
        narrativeState: {
            narrativeList: [],
            loading: true
        },
        profileView: { profileFetchStatus: profileFetchStatuses.NONE },
        orgState:  { orgFetchStatus: orgFetchStatuses.NONE }
    };
};

export function createReduxStore() {
    return createStore(rootReducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
};