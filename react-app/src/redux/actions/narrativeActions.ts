import { ThunkDispatch } from "redux-thunk";
import { StoreState } from "../interfaces";
import { Action, AnyAction, Dispatch } from 'redux';
import { fetchOrgsOfProfileAPI, fetchProfileAPI, fetchNarrativesAPI } from '../../util/API';


const LOAD_NARRATIVES = 'LOAD_NARRATIVES';
const LOAD_MINE_NARRATIVES = 'LOAD_MINE_NARRATIVES';
export function loadNarratives_original() {
    return {
            type: LOAD_NARRATIVES,
            payload: 
                [
                    {
                        wsID: 'foo',
                        permission: 'r',
                        name: 'foofoo',
                        last_saved: 0,
                        users: {},
                        narrative_detail: { creator: 'me' }
    
                    }
                ]
            
    }
}

// function dispatches 
export function loadNarratives (filter:string) {
    // ThunkDispatch<RootState(Store), ExtraArg, Action>;
    return async function (dispatch:ThunkDispatch<StoreState, void, AnyAction>, getState: () => StoreState) {
        const rootStore = getState();
        if(rootStore.auth.userAuthorization !== null){ 
            const token = rootStore.auth.userAuthorization.token;
            const baseURL = rootStore.app.config.baseUrl
            //TODO: AKIYO replace ci.kbase with baseURL
            // const response = await fetchNarrativesAPI('mine', token, baseURL);
            const response = await fetchNarrativesAPI(filter, token, 'https://ci.kbase.us/');
            console.log('loadNarratives action with async', response)
            dispatch({ type: LOAD_MINE_NARRATIVES, payload: { response } })
        }
        
    }
}

