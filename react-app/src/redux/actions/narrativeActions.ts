import { ThunkDispatch } from "redux-thunk";
import { StoreState, NarrativeData } from "../interfaces";
import { AnyAction} from 'redux';
import { fetchNarrativesAPI } from '../../util/API';


const LOAD_NARRATIVES = 'LOAD_NARRATIVES';

/**
 * Fetch narratives dependeing on the filter.
 * filter is one of following: "mine", "shared", "public", "they" <-- gender-neutral singular they
 * "they" is when logged-in user is viewing other user's profile. 
 * "they" - fetch both "public" and "shared" profile and fileter response with profileID
 * @param filter 
 */
export function loadNarratives (filter:string, profileID: string) {
    console.log('filter???', filter, profileID)
    // ThunkDispatch<RootState(Store), ExtraArg, Action>;
    return async function (dispatch:ThunkDispatch<StoreState, void, AnyAction>, getState: () => StoreState) {
        const rootStore = getState();
        if(rootStore.auth.userAuthorization !== null){ 
            const token = rootStore.auth.userAuthorization.token;
            const baseURL = rootStore.app.config.baseUrl;

            //TODO: AKIYO replace ci.kbase with baseURL
            switch(filter) {
                case "they":
                    const publicNarratives = fetchNarrativesAPI('public', token, 'https://ci.kbase.us/');
                    const sharedNarratives = fetchNarrativesAPI('shared', token, 'https://ci.kbase.us/');
                    let narrativeList = [];
                    let narrativePayload:Array<NarrativeData> = [];
                    Promise.all([publicNarratives, sharedNarratives]).then((response) => {
                        // generate combined narrative list 
                        if ( typeof response[0] !== 'undefined' && typeof response[1] !== 'undefined') {
                            narrativeList = response[0].concat(response[1]);
                        } else if (typeof response[0] === 'undefined' && typeof response[1] !== 'undefined' ) {
                            narrativeList = response[1];
                        } else if (typeof response[0] !== 'undefined' && typeof response[1] === 'undefined' ) {
                            narrativeList = response[0];
                        } else {
                            // if publich narrative fetch came back empty, there is something major wrong happened
                            console.error('public narratives are not being fetched correctly.');
                            narrativeList  = [
                                {
                                    wsID: '',
                                    permission: '',
                                    name: 'Something went wrong. Please check console for error messages.',
                                    last_saved: 0,
                                    users: {},
                                    narrative_detail: { creator: '' }
                                }
                            ]
                        }
                        console.log('narrative they profileID', profileID)
                        console.log('narrative they narrativeList', narrativeList);
                        
                        for (let i = 0; i < narrativeList.length; i +=1) {
  
                            if( narrativeList[i].narrative_detail.creator ===  profileID) {
                                narrativePayload.push(narrativeList[i]);
                            }
                        }
                        
                        dispatch({ type: LOAD_NARRATIVES, payload: narrativePayload })     
                                
                    })
                    break;
                case 'mine':
                case 'shared':
                case 'public':
                    const response = await fetchNarrativesAPI(filter, token, 'https://ci.kbase.us/');

                    if(typeof response !== 'undefined') {
                        // console.log("rootstore", rootStore)
                        console.log('loadNarratives action with async', response)
                        dispatch({ type: LOAD_NARRATIVES, payload: response })
                    } else {
                        let fetchFailed =  [
                            {
                                wsID: '',
                                permission: '',
                                name: 'Something went wrong. Please check console for error messages.',
                                last_saved: 0,
                                users: {},
                                narrative_detail: { creator: '' }
                            }
                        ]
                        dispatch({ type: LOAD_NARRATIVES, payload: fetchFailed})
                    }
                    break;

            }            
                        
        } else {
            console.error("I don't think this even should happen, but if it did, I must ask 'what kind of horrible bugs did you you create?'")
        }
    }
}
