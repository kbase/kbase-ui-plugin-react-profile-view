import { StoreState, ProfileAction } from "../interfaces";
import { profileActionTypes } from "../actions/actionTypes";


export default function profileReducer(state:StoreState, action: ProfileAction): StoreState {
    const payload = action.payload;
    switch (action.type) {
        case profileActionTypes.LOAD_PROFILE:
        case profileActionTypes.FETCH_PROFILE_SUCCESS:
        case profileActionTypes.FETCH_PROFILE_ERROR:
            return (
                {
                    ...state,
                    profileView: payload
                }
            )
            break;
        
        case profileActionTypes.INITIAL_RENDER_PROFILE:
        case profileActionTypes.FETCH_PROFILE:
            return {

                ...state
            }

        default:
            return state;
    }

}