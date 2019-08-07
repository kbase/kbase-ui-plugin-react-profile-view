import { fetchOrgsOfProfileAPI, fetchProfileAPI, fetchNarrativesAPI } from '../../util/API';


const LOAD_NARRATIVES = 'LOAD_NARRATIVES';
export function loadNarratives_original (param) {
    console.log('loadNarratives action')
    return { type: LOAD_NARRATIVES,
    payload: { param } // this is what I get from API calls or param passed from  dispatch
    }   
}

export function loadNarratives (filter, token, baseURL) {
    console.log('loadNarratives action')
    return async function(dispatch, getState) {
        const response = await fetchNarrativesAPI(filter, token, baseURL);
        console.log('loadNarratives action', response)
        dispatch({ type: LOAD_NARRATIVES,
            payload: { response } // this is what I get from API calls or param passed from  dispatch
        })    

    }
    

    // fetchNarrativesAPI('mine', this.props.token, this.props.baseURL)

}