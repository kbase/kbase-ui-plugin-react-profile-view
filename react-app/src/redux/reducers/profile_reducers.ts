import { StoreState, ProfileView, profileActionType } from "../interfaces";



export default function profileReducer(state:StoreState, action: profileActionType): StoreState {
    const payload = action.payload;
    console.log('profile reducers', action)
    switch (action.type) {
        case 'LOAD_PROFILE':
            console.log('in LOAD profile reducer', payload);
            // let loadProfilePayload = {
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