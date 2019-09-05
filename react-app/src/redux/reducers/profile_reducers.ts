import { StoreState, ProfileActionType } from "../interfaces";



export default function profileReducer(state:StoreState, action: ProfileActionType): StoreState {
    const payload = action.payload;
    switch (action.type) {
        case 'LOAD_PROFILE':
            return (
                {
                    ...state,
                    profileView: payload
                }
            )
            break;

        default:
            return state;
    }

}