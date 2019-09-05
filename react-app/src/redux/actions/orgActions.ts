import { ThunkDispatch } from 'redux-thunk';
import { StoreState, OrgProp, Org } from '../interfaces';
import { AnyAction } from 'redux';
import { fetchOrgsOfProfileAPI } from '../../util/API'
import { loadOrgs, fetchOrgs, fetchErrorOrgs } from './actionCreators';
import { orgFetchStatuses } from '../fetchStatuses';


/**
 * 
 * @param userID 
 */
export function getOrgs(profileID:string){
    // add dispatch to let the app know fetch is started so spinner can be loaded 
    return async function (dispatch:ThunkDispatch<StoreState, void, AnyAction>, getState:() => StoreState ) {
        dispatch(fetchOrgs());
        const rootStore = getState();
        let orgArr: Array<OrgProp> = [];
        if(rootStore.auth.userAuthorization !== null ) {
            let token: string = rootStore.auth.userAuthorization.token;
            let response: Array<Org> = await fetchOrgsOfProfileAPI(profileID, token, rootStore.app.config.baseUrl);
            if( typeof response !== 'undefined' ) {
                response.forEach((org) => {
                    orgArr.push({ name: org.name, url: rootStore.app.config.baseUrl + '/#org/' + org.id });
                });
                
                dispatch(loadOrgs({ orgList: orgArr, orgFetchStatus: orgFetchStatuses.SUCCESS}));
            } else {
                dispatch(fetchErrorOrgs());
            }
        } 
    }
}

