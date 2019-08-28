import { StoreState, OrgsActionType } from '../interfaces';

export default function orgsReducer(state: StoreState, action: OrgsActionType){
    const payload = action.payload;
    switch (action.type) {
        case 'LOAD_ORGS':
            console.log('im in orgs reducer', payload)
            return (
                { ...state,
                    orgListArray: payload
                }
            )
            break;

            default:
                return state;
    }
}