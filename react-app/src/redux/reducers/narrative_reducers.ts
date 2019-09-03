import { StoreState, NarrativeAction } from "../interfaces";



export default function narrativeReducer(state: StoreState, action: NarrativeAction):StoreState   {
    const payload = action.payload;
    switch (action.type) {
        
        case 'LOAD_NARRATIVES':
            return (
                { ...state,
                    narrativeState: payload
                }
            );
            
        break;
        
        default: 
                return state;
    }
}