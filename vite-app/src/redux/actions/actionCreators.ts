import {
    NarrativesView,
    OrgsView,
    ProfileView,
    SimpleError,
} from '../interfaces';
import {
    ActionTypes, FetchNarrativesError, FetchNarrativesFetching,
    FetchNarrativesNone, FetchNarrativesSuccess,
    FetchOrgsError, FetchOrgsFetching, FetchOrgsNone, FetchOrgsSuccess,
    FetchProfileFetching,
    FetchProfileNone, FetchProfileRefetching, FetchProfileSuccess
} from './actionTypes';

// PROFILE

// fetching profile data is initiated
// export function fetchProfile() {
//     return {
//         type: ActionTypes.FETCH_PROFILE
//     };
// }

// during mounting - render before componentDidMount
export function fetchProfileNone(): FetchProfileNone {
    return {
        type: ActionTypes.FETCH_PROFILE_NONE,
    };
}

export function fetchProfileFetching(): FetchProfileFetching {
    return {
        type: ActionTypes.FETCH_PROFILE_FETCHING
    };
}

export function fetchProfileRefetching(): FetchProfileRefetching {
    return {
        type: ActionTypes.FETCH_PROFILE_REFETCHING
    };
}

// fetching profile data was successful 
export function fetchProfileSuccess(profileView: ProfileView): FetchProfileSuccess {
    return {
        type: ActionTypes.FETCH_PROFILE_SUCCESS,
        profileView
    };
}

// fetch profile failed
export function fetchProfileError(error: SimpleError) {
    return {
        type: ActionTypes.FETCH_PROFILE_ERROR,
        error
    };
}



// ORGS


// fetching orgs is initiated
// export function fetchOrgs() {
//     return {
//         type: ActionTypes.FETCH_ORGS
//     };
// }

// during mounting - render before componentDidMount
export function fetchOrgsNone(): FetchOrgsNone {
    return {
        type: ActionTypes.FETCH_ORGS_NONE,
    };
}

export function fetchOrgsFetching(): FetchOrgsFetching {
    return {
        type: ActionTypes.FETCH_ORGS_FETCHING,
    };
}

// fetching Orgs was successful 
export function fetchOrgsSuccess(orgsView: OrgsView): FetchOrgsSuccess {
    return {
        type: ActionTypes.FETCH_ORGS_SUCCESS,
        orgsView
    };
}

// fetch orgs failed
export function fetchOrgsError(error: SimpleError): FetchOrgsError {
    return {
        type: ActionTypes.FETCH_ORGS_ERROR,
        error
    };
}

// NARRATIVES

// during mounting - render before componentDidMount
export function fetchNarrativesNone(): FetchNarrativesNone {
    return {
        type: ActionTypes.FETCH_NARRATIVES_NONE,
    };
}

export function fetchNarrativesFetching(): FetchNarrativesFetching {
    return {
        type: ActionTypes.FETCH_NARRATIVES_FETCHING,
    };
}

// fetching Orgs was successful 
export function fetchNarrativesSuccess(narrativesView: NarrativesView): FetchNarrativesSuccess {
    return {
        type: ActionTypes.FETCH_NARRATIVES_SUCCESS,
        narrativesView
    };
}

// fetch orgs failed
export function fetchNarrativesError(error: SimpleError): FetchNarrativesError {
    return {
        type: ActionTypes.FETCH_NARRATIVES_ERROR,
        error
    };
}





