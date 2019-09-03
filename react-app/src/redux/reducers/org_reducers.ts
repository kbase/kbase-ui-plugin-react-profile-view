import { StoreState, OrgsAction } from '../interfaces';

export default function orgsReducer(state: StoreState, action: OrgsAction){
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