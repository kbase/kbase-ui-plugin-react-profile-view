import { Action, Reducer } from "redux";
import { StoreState } from "../store";

export default function narrativeReducer(state: StoreState, action:Action ):StoreState  {
    console.log('im in narrative reducer')
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
    )
}