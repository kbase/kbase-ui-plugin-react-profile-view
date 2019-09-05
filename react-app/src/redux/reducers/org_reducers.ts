import { StoreState, OrgsActionType } from '../interfaces';

export default function orgsReducer(state: StoreState, action: OrgsActionType){
    const payload = action.payload;
    switch (action.type) {
        case 'LOAD_ORGS':
            return (
                { ...state,
                    orgState: payload
                }
            )
            break;

            default:
                return state;
    }
}