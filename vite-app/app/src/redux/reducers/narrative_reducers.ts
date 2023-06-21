import { ActionTypes } from '../actions/actionTypes';
import { NarrativeAction, StoreState } from '../interfaces';


export default function narrativeReducer(state: StoreState, action: NarrativeAction): StoreState {
    const payload = action.payload;
    switch (action.type) {
        case ActionTypes.FETCH_NARRATIVE_SUCCESS:
        case ActionTypes.FETCH_NARRATIVE_ERROR:
            return (
                {
                    ...state,
                    narrativeState: payload
                }
            );

        default:
            return state;
    }
}