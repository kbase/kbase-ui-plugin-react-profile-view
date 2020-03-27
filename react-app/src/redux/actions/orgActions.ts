import { ThunkDispatch } from 'redux-thunk';
import { StoreState, OrgList, OrgFetchError } from '../interfaces';
import { AnyAction } from 'redux';
import { fetchOrgsOfProfileAPI } from '../../util/API';
import { loadOrgs, fetchOrgs, fetchErrorOrgs } from './actionCreators';
import { AsyncFetchStatus } from '../fetchStatuses';
import { ActionTypes } from './actionTypes';

export interface OrgActionNone {
    type: ActionTypes.FETCH_ORGS_NONE;
}

export interface OrgActionFetching {
    type: ActionTypes.FETCH_ORGS_FETCHING;
}

export interface OrgActionSuccess {
    type: ActionTypes.FETCH_ORGS_SUCCESS,
    payload: OrgList;
}

export interface OrgActionRefetching {
    type: ActionTypes.FETCH_ORGS_REFETCHING,
    payload: OrgList;
}

export interface OrgActionError {
    type: ActionTypes.FETCH_ORGS_ERROR,
    payload: OrgFetchError;
}

export type OrgAction = OrgActionNone | OrgActionFetching | OrgActionSuccess | OrgActionError | OrgActionRefetching;

/**
 * 
 * @param userID 
 */
// export function getOrgs(username: string) {
//     // add dispatch to let the app know fetch is started so spinner can be loaded 
//     return async function (dispatch: ThunkDispatch<StoreState, void, AnyAction>, getState: () => StoreState) {
//         dispatch(fetchOrgs());
//         const rootStore = getState();
//         let orgArr: Array<OrgProp> = [];
//         if (rootStore.auth.userAuthorization !== null) {
//             const {
//                 auth: {
//                     userAuthorization: {
//                         token
//                     }
//                 },
//                 app: {
//                     config: {
//                         services: {
//                             ServiceWizard: {
//                                 url
//                             }
//                         }
//                     }
//                 }
//             } = rootStore;

//             let response = await fetchOrgsOfProfileAPI(username, token, url);
//             if (typeof response !== 'undefined') {
//                 if (typeof response[0] === 'number') {
//                     // response is error message array 
//                     dispatch(fetchErrorOrgs({ orgError: response, orgFetchStatus: AsyncFetchStatus.ERROR }));
//                 } else if (typeof response[0] === 'object') {
//                     // typescript!
//                     let anyFoo: any = response;
//                     let res = anyFoo as Array<Org>;
//                     res.forEach((org) => {
//                         orgArr.push({ name: org.name, url: '/#org/' + org.id, logoURL: org.custom.logourl });
//                     });
//                     dispatch(loadOrgs({ orgList: orgArr, orgFetchStatus: AsyncFetchStatus.SUCCESS }));
//                 } else {
//                     // empty array is returned
//                     dispatch(loadOrgs({ orgList: response, orgFetchStatus: AsyncFetchStatus.SUCCESS }));
//                 };
//             } else {
//                 dispatch(fetchErrorOrgs({ orgError: [418, 'Please check console errors.'], orgFetchStatus: AsyncFetchStatus.ERROR }));
//             };
//         };
//     };
// };

export function getOrgs(username: string) {
    // add dispatch to let the app know fetch is started so spinner can be loaded 
    return async function (dispatch: ThunkDispatch<StoreState, void, AnyAction>, getState: () => StoreState) {
        dispatch(fetchOrgs());
        const rootStore = getState();
        if (rootStore.auth.userAuthorization !== null) {
            const {
                auth: {
                    userAuthorization: {
                        token
                    }
                },
                app: {
                    config: {
                        services: {
                            ServiceWizard: {
                                url: serviceWizardURL
                            }
                        }
                    }
                }
            } = rootStore;

            try {
                const response = await fetchOrgsOfProfileAPI(username, token, serviceWizardURL);
                const orgs = response
                    .map((org) => {
                        return {
                            name: org.name,
                            url: '/#org/' + org.id,
                            logoURL: org.custom.logourl
                        };
                    });
                dispatch(loadOrgs({ orgList: orgs, orgFetchStatus: AsyncFetchStatus.SUCCESS }));
            } catch (ex) {
                dispatch(fetchErrorOrgs({ orgError: ex.message, orgFetchStatus: AsyncFetchStatus.ERROR }));
            }

            // try {
            //     const response = await fetchOrgsOfProfileAPI(username, token, groupsURL);
            //     const orgs = response
            //         .map((org) => {
            //             return {
            //                 name: org.name,
            //                 url: '/#org/' + org.id,
            //                 logoURL: org.custom.logourl
            //             };
            //         });
            //     dispatch(loadOrgs({ orgList: orgs, orgFetchStatus: AsyncFetchStatus.SUCCESS }));
            // } catch (ex) {
            //     dispatch(fetchErrorOrgs({ orgError: ex.message, orgFetchStatus: AsyncFetchStatus.ERROR }));
            // }



            // if (typeof response !== 'undefined') {
            //     if (typeof response[0] === 'number') {
            //         // response is error message array 
            //         dispatch(fetchErrorOrgs({ orgError: response, orgFetchStatus: AsyncFetchStatus.ERROR }));
            //     } else if (typeof response[0] === 'object') {
            //         // typescript!
            //         let anyFoo: any = response;
            //         let res = anyFoo as Array<Org>;
            //         res.forEach((org) => {
            //             orgArr.push({ name: org.name, url: '/#org/' + org.id, logoURL: org.custom.logourl });
            //         });
            //         dispatch(loadOrgs({ orgList: orgArr, orgFetchStatus: AsyncFetchStatus.SUCCESS }));
            //     } else {
            //         // empty array is returned
            //         dispatch(loadOrgs({ orgList: response, orgFetchStatus: AsyncFetchStatus.SUCCESS }));
            //     };
            // } else {
            //     dispatch(fetchErrorOrgs({ orgError: [418, 'Please check console errors.'], orgFetchStatus: AsyncFetchStatus.ERROR }));
            // };
        };
    };
};

