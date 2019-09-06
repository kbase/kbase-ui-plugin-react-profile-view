import { StoreState, NarrativeAction } from "../interfaces";
import { narrativeActionTypes } from '../actions/actionTypes';


export default function narrativeReducer(state: StoreState, action: NarrativeAction):StoreState {
    const payload = action.payload;
    // console.log("narrative", payload)
    switch (action.type) {
        
        case narrativeActionTypes.FETCH_NARRATIVE_SUCCESS:
        case narrativeActionTypes.FETCH_NARRATIVE_ERROR:
            return (
                { ...state,
                    narrativeState: payload
                }
            );
            
        break;
        
        default: 
                return state;
    }
}