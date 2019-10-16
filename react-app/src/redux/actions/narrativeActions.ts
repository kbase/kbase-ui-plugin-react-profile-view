import { ThunkDispatch } from "redux-thunk";
import { StoreState, NarrativeData } from "../interfaces";
import { AnyAction } from 'redux';
import { fetchNarrativesAPI } from '../../util/API';
import { narrativeActionTypes } from '../actions/actionTypes';

/**
 * Fetch narratives dependeing on the filter.
 *  - filter is one of following: "mine", "shared", "public", "they" <-- gender-neutral singular they
 *  - "they" is when logged-in user is viewing other user's profile. 
 *  - "they" - fetch both "public" and "shared" profile and fileter response with profileID
 * @param filter 
 */
export function loadNarratives(filter: string, profileID: string) {
    // ThunkDispatch<RootState(Store), ExtraArg, Action>;
    return async function (dispatch: ThunkDispatch<StoreState, void, AnyAction>, getState: () => StoreState) {
        const rootStore = getState();
        if (rootStore.auth.userAuthorization !== null) {
            const token = rootStore.auth.userAuthorization.token;
            const baseURL = rootStore.app.config.baseUrl;

            switch (filter) {
                case "they":
                    const publicNarratives = fetchNarrativesAPI('public', token, baseURL);
                    const sharedNarratives = fetchNarrativesAPI('shared', token, baseURL);
                    let allNarratives: Array<NarrativeData> = [];
                    let narrativeList: Array<NarrativeData> = [];
                    Promise.all([publicNarratives, sharedNarratives]).then((response) => {
                        // generate combined narrative list 
                        if (typeof response[0] !== 'undefined' && typeof response[1] !== 'undefined') {
                            allNarratives = response[0].concat(response[1]);
                        } else if (typeof response[0] === 'undefined' && typeof response[1] !== 'undefined') {
                            // if public narrative fetch came back empty, there is something major wrong happened
                            console.error('error occuerred during fetching narratives.');
                            allNarratives = response[1];
                        } else if (typeof response[0] !== 'undefined' && typeof response[1] === 'undefined') {
                            allNarratives = response[0];
                        } else {
                            // if public narrative fetch came back empty, there is something major wrong happened
                            console.error('error occuerred during fetching narratives.');
                            narrativeList = [
                                {
                                    wsID: '',
                                    permission: '',
                                    name: 'Something went wrong. Please check console for error messages.',
                                    last_saved: 0,
                                    users: {},
                                    narrative_detail: { creator: '' }
                                }
                            ];
                        };

                        for (let i = 0; i < allNarratives.length; i += 1) {

                            if (allNarratives[i].narrative_detail.creator === profileID) {
                                narrativeList.push(allNarratives[i]);
                            };
                        };

                        dispatch({
                            type: narrativeActionTypes.FETCH_NARRATIVE_SUCCESS,
                            payload: { narrativeList: narrativeList, loading: false }
                        });

                    });
                    break;
                case 'mine':
                case 'shared':
                case 'public':
                    const response = await fetchNarrativesAPI(filter, token, baseURL);

                    if (typeof response !== 'undefined') {
                        dispatch({
                            type: narrativeActionTypes.FETCH_NARRATIVE_SUCCESS,
                            payload: { narrativeList: response, loading: false }
                        })
                    } else {
                        let fetchFailed = [
                            {
                                wsID: '',
                                permission: '',
                                name: 'Something went wrong. Please check console for error messages.',
                                last_saved: 0,
                                users: {},
                                narrative_detail: { creator: '' }
                            }
                        ];

                        dispatch({
                            type: narrativeActionTypes.FETCH_NARRATIVE_ERROR,
                            payload: { narrativeList: fetchFailed, loading: false }
                        });
                    };
                    break;

            };

        } else {
            console.error("I don't think this even should happen, but if it did, I must ask 'what kind of horrible bugs did you you create?'");
        };
    };
};
