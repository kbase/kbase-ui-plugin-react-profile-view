import { AsyncProcessStatus } from '@kbase/ui-lib';
import { ActionTypes, FetchNarrativesAction } from '../actions/actionTypes';
import { StoreState } from '../interfaces';


export default function narrativeReducer(state: StoreState, action: FetchNarrativesAction): StoreState {
    switch (action.type) {
        case ActionTypes.FETCH_NARRATIVES_NONE:
            return {
                ...state,
                narrativeState: {
                    status: AsyncProcessStatus.NONE
                }
            }
        case ActionTypes.FETCH_NARRATIVES_FETCHING:
            return {
                ...state,
                narrativeState: {
                    status: AsyncProcessStatus.PENDING
                }
            }
        case ActionTypes.FETCH_NARRATIVES_SUCCESS:
            return {
                ...state,
                narrativeState: {
                    status: AsyncProcessStatus.SUCCESS,
                    value: action.narrativesView
                }
            }
        case ActionTypes.FETCH_NARRATIVES_ERROR:
            return {
                ...state,
                narrativeState: {
                    status: AsyncProcessStatus.ERROR,
                    error: action.error
                }
            }

        default:
            // Yeah, should never get here...
            return state;
    }
}