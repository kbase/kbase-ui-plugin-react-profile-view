import { StoreState, NarrativeActionType } from "../interfaces";



export default function narrativeReducer(state: StoreState, action: NarrativeActionType):StoreState   {
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