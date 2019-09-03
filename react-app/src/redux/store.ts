import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { makeBaseStoreState } from "@kbase/ui-lib";
import { StoreState,  NarrativeData, ProfileView } from './interfaces';
import rootReducer from "./reducers/index";


// When app starts, this runs first to set the initial state.
export function makeInitialStoreState(): StoreState {
    const baseStoreState = makeBaseStoreState();
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
        gravatarHash: '',
        profileIsFetching: 'none'
    }
    

    return {
        ...baseStoreState,  
        narrativeState: {
            narrativeList: [],
            loading: true
        },
        profileView: profileViewInitialState,
        orgState: {
            orgList: [],
            loading: true
        }
    };
}
export function createReduxStore() {
    return createStore(rootReducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
}