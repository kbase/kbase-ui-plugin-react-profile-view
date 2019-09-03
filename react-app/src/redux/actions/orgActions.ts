import { ThunkDispatch } from 'redux-thunk';
import { StoreState, OrgProp, Org } from '../interfaces';
import { AnyAction } from 'redux';
import { fetchOrgsOfProfileAPI } from '../../util/API'
import { loadOrgs } from '../actions/actions';

// const LOAD_ORGS = 'LOAD_ORGS';

/**
 * 
 * @param userID 
 */
export function loadOrgsAction(profileID:string){
    // add dispatch to let the app know fetch is started so spinner can be loaded 
    // dispatch({ type: FETCH_ORGS })
    return async function (dispatch:ThunkDispatch<StoreState, void, AnyAction>, getState:() => StoreState ) {
        const rootStore = getState();
        let orgArr: Array<OrgProp> = [];
        if(rootStore.auth.userAuthorization !== null ) {
            let token: string = rootStore.auth.userAuthorization.token;
            let response: Array<Org> = await fetchOrgsOfProfileAPI(profileID, token, rootStore.app.config.baseUrl);
            if( typeof response !== 'undefined' ) {
                response.forEach((org) => {
                    orgArr.push({ name: org.name, url: rootStore.app.config.baseUrl + '/#org/' + org.id });
                });
            } else {
                // Fetch error
                orgArr = [
                    {
                        name: 'Something went wrong during fetching organizations. Check console for errors.',
                        url: ''
                    }
                ]
            }
        } 
        // dispatch({ type: LOAD_ORGS, payload: {orgList: orgArr, loading: false} });
        dispatch(loadOrgs(orgArr, false));
    }
}

