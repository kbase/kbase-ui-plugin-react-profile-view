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
        case 'LOAD_FAKE_NARRATIVES':
            return (
                { ...state,
                    narrativeDataArray: [
                        // list of narratives {key: string;
                        // wsID: string;
                        // name: string;
                        // last_saved: number;}
                        {
                            wsID: 'foo',
                            permission: 'r',
                            name: 'foofoo',
                            last_saved: 0,
                            users: {},
                            narrative_detail: { creator: 'me' }
                            
                        },
                        {
                            wsID: 'bar',
                            permission: 'r',
                            name: 'barbar',
                            last_saved: 0,
                            users: {},
                            narrative_detail: { creator: 'me' }
                        },
                        {
                            wsID: 'baz',
                            permission: 'r',
                            name: 'bazbaz',
                            last_saved: 0,
                            users: {},
                            narrative_detail: { creator: 'me' }
                        }
                    ]
                }
            );
            
            break;
                
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