import { Action } from "redux";
import { StoreState } from "../interfaces";
import { NarrativeData } from "../interfaces";

interface narrativeFetchActionType {
    type: string;
    payload: Array<NarrativeData>
}

export default function narrativeReducer(state: StoreState, action: narrativeFetchActionType):StoreState   {
    const payload = action.payload;
    switch (action.type) {
        
        case 'LOAD_NARRATIVES':
            console.log('im in narrative reducer', payload)
            return (
                { ...state,
                    narrativeDataArray: payload
                }
            );
            
        break;
        
        default: 
                return state;
    }
}