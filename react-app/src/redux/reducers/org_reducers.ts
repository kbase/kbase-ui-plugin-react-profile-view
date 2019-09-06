import { StoreState, OrgsAction, loadOrgAction } from '../interfaces';
import { orgsActionTypes } from "../actions/actionTypes";
import { orgFetchStatuses } from '../fetchStatuses';

export default function orgsReducer(state: StoreState, action: loadOrgAction){
    const payload = action.payload;
    // console.log('in orgs reducer ', payload)
    switch (action.type) {

        case orgsActionTypes.FETCH_ORGS_SUCCESS:
            
                return (
                    { ...state,
                        orgState: payload
                    }
                )
                break;

        case orgsActionTypes.FETCH_ORGS:
                return (
                    { ...state,
                        orgState: { orgFetchStatus: orgFetchStatuses.FETCHING }
                    }
                )
                break;

        case orgsActionTypes.FETCH_ORGS_ERROR:
                return (
                    { ...state,
                        orgState: { orgFetchStatus: orgFetchStatuses.ERROR }
                    }
                )
                break;
    
        case orgsActionTypes.FETCH_ORGS_NONE:
                return (
                    { ...state,
                        orgState: { orgFetchStatus: orgFetchStatuses.ERROR }
                    }
                )
                break;
        
            default:
                return state;
    }
}