import { StoreState, UserProfileService } from "../interfaces";


interface profileActionType {
    type: string;
    payload: UserProfileService;
}

export default function profileReducer(state:StoreState, action: profileActionType): StoreState {
    const payload = action.payload;
    console.log('profile reducers', action)
    // switch (action.type) {
    //     case 'LOAD_PROFILE':
    //         console.log('in LOAD profile reducer', payload);
    //         // return (
    //         //     {
    //         //         ...state,
    //         //         profile: payload
    //         //     }
    //         // )
    //         break;

    //     default:
            return state;
    // }

}