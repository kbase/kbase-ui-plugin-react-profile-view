import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { makeBaseStoreState } from '@kbase/ui-components';
import { AsyncFetchStatus } from './fetchStatuses';
import { StoreState } from './interfaces';
import rootReducer from './reducers/index';

// TODO: need to use action creator initialRenderOrgs & initialRenderProfile instead

// When app starts, this runs first to set the initial state.
export function makeInitialStoreState(): StoreState {
    const baseStoreState = makeBaseStoreState();
    return {
        ...baseStoreState,
        narrativeState: {
            narrativeList: [],
            loading: true,
            isOwner: false
        },
        profileView: { profileFetchStatus: AsyncFetchStatus.NONE },
        orgState: { orgFetchStatus: AsyncFetchStatus.NONE }
    };
}

export function createReduxStore() {
    return createStore(rootReducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
}