import { ThunkDispatch } from "redux-thunk";
import { StoreState, NarrativeData } from "../interfaces";
import { AnyAction } from 'redux';
import { fetchNarrativesAPI } from '../../util/API';
import { ActionTypes } from '../actions/actionTypes';

/**
 * Fetch narratives depending on the filter.
 *  - filter is one of following: "mine", "shared", "public", "they" <-- gender-neutral singular they
 *  - "they" is when logged-in user is viewing other user's profile. 
 *  - "they" - fetch both "public" and "shared" profile and filter response with username
 * @param filter 
 */
export function loadNarratives(filter: string, viewedUsername: string) {
    // ThunkDispatch<RootState(Store), ExtraArg, Action>;
    return async function (dispatch: ThunkDispatch<StoreState, void, AnyAction>, getState: () => StoreState) {
        const rootStore = getState();
        if (rootStore.auth.userAuthorization !== null) {
            const token = rootStore.auth.userAuthorization.token;
            const authorizedUsername = rootStore.auth.userAuthorization.username;
            const serviceWizardURL = rootStore.app.config.services.ServiceWizard.url;
            const isOwner = viewedUsername === authorizedUsername;
            switch (filter) {
                case "they":
                    const publicNarratives = fetchNarrativesAPI('public', token, serviceWizardURL);
                    const sharedNarratives = fetchNarrativesAPI('shared', token, serviceWizardURL);
                    let allNarratives: Array<NarrativeData> = [];
                    let narrativeList: Array<NarrativeData> = [];
                    Promise.all([publicNarratives, sharedNarratives])
                        .then((response) => {
                            // generate combined narrative list 
                            if (typeof response[0] !== 'undefined' && typeof response[1] !== 'undefined') {
                                allNarratives = response[0].concat(response[1]);
                            } else if (typeof response[0] === 'undefined' && typeof response[1] !== 'undefined') {
                                // if public narrative fetch came back empty, there is something major wrong happened
                                console.error('error occurred during fetching narratives.');
                                allNarratives = response[1];
                            } else if (typeof response[0] !== 'undefined' && typeof response[1] === 'undefined') {
                                allNarratives = response[0];
                            } else {
                                // if public narrative fetch came back empty, there is something major wrong happened
                                console.error('error occurred during fetching narratives.');
                                narrativeList = [{
                                    wsID: '',
                                    permission: '',
                                    name: 'Something went wrong. Please check console for error messages.',
                                    last_saved: 0,
                                    users: {},
                                    owner: '',
                                    narrative_detail: { creator: '' }
                                }];
                            };

                            for (let i = 0; i < allNarratives.length; i += 1) {
                                // TODO: should be owner not creator
                                if (allNarratives[i].owner === viewedUsername) {
                                    narrativeList.push(allNarratives[i]);
                                };
                            };

                            dispatch({
                                type: ActionTypes.FETCH_NARRATIVE_SUCCESS,
                                payload: {
                                    narrativeList,
                                    loading: false,
                                    isOwner
                                }
                            });

                        });
                    break;
                case 'mine':
                case 'shared':
                case 'public':
                    const response = await fetchNarrativesAPI(filter, token, serviceWizardURL);

                    if (typeof response !== 'undefined') {
                        dispatch({
                            type: ActionTypes.FETCH_NARRATIVE_SUCCESS,
                            payload: {
                                narrativeList: response,
                                loading: false,
                                isOwner
                            }
                        });
                    } else {
                        let fetchFailed = [{
                            wsID: '',
                            permission: '',
                            name: 'Something went wrong. Please check console for error messages.',
                            last_saved: 0,
                            users: {},
                            owner: '',
                            narrative_detail: { creator: '' }
                        }];

                        dispatch({
                            type: ActionTypes.FETCH_NARRATIVE_ERROR,
                            payload: {
                                narrativeList: fetchFailed,
                                loading: false,
                                isOwner
                            }
                        });
                    };
                    break;
            };
        } else {
            console.error("I don't think this even should happen, but if it did, I must ask 'what kind of horrible bugs did you create?'");
        };
    };
};
