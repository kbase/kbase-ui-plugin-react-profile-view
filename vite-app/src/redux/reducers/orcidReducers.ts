import { AsyncProcessStatus } from '@kbase/ui-lib';
import { ActionTypes, FetchORCIDIdAction } from '../actions/actionTypes';
import { StoreState } from '../interfaces';

export default function reducer(state: StoreState, action: FetchORCIDIdAction): StoreState {
    switch (action.type) {
        case ActionTypes.FETCH_ORCID_NONE:
            return (
                {
                    ...state,
                    orcidState: {
                        status: AsyncProcessStatus.NONE
                    }
                }
            );

        case ActionTypes.FETCH_ORCID_PENDING:
            return (
                {
                    ...state,
                    orcidState: {
                        status: AsyncProcessStatus.PENDING
                    }
                }
            );
        case ActionTypes.FETCH_ORCID_SUCCESS:
            return (
                {
                    ...state,
                    orcidState: {
                        status: AsyncProcessStatus.SUCCESS,
                        value: {
                            orcidId: action.orcidId
                        }
                    }
                }
            );
        case ActionTypes.FETCH_ORCID_ERROR:
            return (
                {
                    ...state,
                    orcidState: {
                        status: AsyncProcessStatus.ERROR,
                        error: {
                            message: action.message
                        }
                    }
                }
            );
        default:
            return state;
    }
}