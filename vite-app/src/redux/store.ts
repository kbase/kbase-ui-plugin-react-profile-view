import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { makeBaseStoreState } from '@kbase/ui-components';
import { AsyncProcessStatus } from '@kbase/ui-lib';
import { AsyncFetchStatus } from './asyncFetchState';
import { StoreState } from './interfaces';
import rootReducer from './reducers/index';

// TODO: need to use action creator initialRenderOrgs & initialRenderProfile instead

// When app starts, this runs first to set the initial state.
export function makeInitialStoreState(): StoreState {
    const baseStoreState = makeBaseStoreState();
    // A big fake for now, but at least it will work for the most common case.
    const uiOrigin = (() => {
        const origin = document.location.origin;
        if (origin.match(/https:\/\/.*kbase.us\//)) {
            return origin;
        }
        return 'https://ci.kbase.us';
    })();
    return {
        ...baseStoreState,
        // narrativeState: {
        //     narrativeList: [],
        //     loading: true,
        //     isOwner: false
        // },
        supplementalBaseState: { uiOrigin },
        narrativeState: { status: AsyncProcessStatus.NONE },
        profileState: { status: AsyncFetchStatus.NONE },
        orgsState: { status: AsyncFetchStatus.NONE },
        orcidState: { status: AsyncProcessStatus.NONE }
    };
}

export function createReduxStore() {
    return createStore(rootReducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
}