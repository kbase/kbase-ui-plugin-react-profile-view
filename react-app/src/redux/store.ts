import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { makeBaseStoreState } from "@kbase/ui-lib";
import { StoreState,  NarrativeData, ProfileView, OrgState, OrgProp } from './interfaces';
import rootReducer from "./reducers/index";


// When app starts, this runs first to set the initial state.
export function makeInitialStoreState(): StoreState {
    const baseStoreState = makeBaseStoreState();
    // setting initial empty narrative state
    const narrativeInitialState: Array<NarrativeData>  = [{
        wsID: '',
        permission: '',
        name: '',
        last_saved: 0,
        users: {},
        narrative_detail: { creator: '' }
    }];
    // 
    const profileViewInitialState: ProfileView = {
        userName: {
            name: '',
            userID: ''
        },
        profileData: {
            organization: '',
            department: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            affiliations: [],
            researchStatement: '', 
            jobTitle: '',
            jobTitleOther: '',
            researchInterests: [],
            fundingSource: '',
            gravatarDefault: '',
            avatarOption: '',
        },
        gravatarHash: ''
    }

    const orgListInitalState: Array<OrgProp> = 
        [{
            name: '',
            url: ''
        }]
    

    console.log('baseStoreState', baseStoreState)
    return {
        // ...baseStoreState, userProfileApp:{ narrativeDataArray: narrativePreloadedState }
        ...baseStoreState,  
        narrativeDataArray: narrativeInitialState, 
        profileView: profileViewInitialState,
        orgListArray: orgListInitalState
    };
}
export function createReduxStore() {
    return createStore(rootReducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
}