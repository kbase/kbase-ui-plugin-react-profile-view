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
export function getOrgs(profileID: string) {
    // add dispatch to let the app know fetch is started so spinner can be loaded 
    return async function (dispatch: ThunkDispatch<StoreState, void, AnyAction>, getState: () => StoreState) {
        dispatch(fetchOrgs());
        const rootStore = getState();
        let orgArr: Array<OrgProp> = [];
        if (rootStore.auth.userAuthorization !== null) {
            let token: string = rootStore.auth.userAuthorization.token;
            let response= await fetchOrgsOfProfileAPI(profileID, token, rootStore.app.config.baseUrl);
            if (typeof response !== 'undefined') {
                if (typeof response[0] === 'number') {
                    // response is error message array 
                    dispatch(fetchErrorOrgs({ orgError: response, orgFetchStatus: orgFetchStatuses.ERROR} ));
                } else if (typeof response[0] === 'object') {
                    // typescript!
                    let anyFoo:any = response;
                    let res = anyFoo as Array<Org>;
                    res.forEach((org) => {
                        orgArr.push({ name: org.name, url: rootStore.app.config.baseUrl + '/#org/' + org.id });
                    });
                    dispatch(loadOrgs({ orgList: orgArr, orgFetchStatus: orgFetchStatuses.SUCCESS }));
                } else {
                    // empty array is returned
                    dispatch(loadOrgs({ orgList: response, orgFetchStatus: orgFetchStatuses.SUCCESS }));
                };
            } else {
                dispatch(fetchErrorOrgs({orgError:[418, 'Please check console errors.'], orgFetchStatus: orgFetchStatuses.ERROR} ));
            };
        };
    };
};

