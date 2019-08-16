import { Action } from "redux";
import { StoreState } from "../interfaces";
import { NarrativeData } from "../interfaces";

interface narrativeFetchActionType {
    type: string;
    payload: Array<NarrativeData>
}

export default function narrativeReducer(state: StoreState, action: narrativeFetchActionType):StoreState   {
    console.log('im in narrative reducer', action.payload)
    const payload = action.payload;
    console.log('im in narrative reducer', payload)
    switch (action.type) {
        case 'LOAD_NARRATIVES':
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
        case 'LOAD_MINE_NARRATIVES':

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