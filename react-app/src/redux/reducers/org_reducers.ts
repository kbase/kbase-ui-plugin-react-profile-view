import { StoreState, OrgAction } from '../interfaces';
import { orgsActionTypes } from '../actions/actionTypes';
import { orgFetchStatuses } from '../fetchStatuses';

export default function orgsReducer(state: StoreState, action: OrgAction){
    const payload = action.payload;
    switch (action.type) {
        case orgsActionTypes.FETCH_ORGS_SUCCESS:
                return (
                    { ...state,
                        orgState: payload
                    }
                );

        case orgsActionTypes.FETCH_ORGS:
                return (
                    { ...state,
                        orgState: { orgFetchStatus: orgFetchStatuses.FETCHING }
                    }
                );

        case orgsActionTypes.FETCH_ORGS_ERROR:

                return (
                    { ...state,
                        orgState: payload
                    }
                );
    
        case orgsActionTypes.FETCH_ORGS_NONE:
                return (
                    { ...state,
                        orgState: { orgFetchStatus: orgFetchStatuses.NONE }
                    }
                );
        
            default:
                return state;
    }
}