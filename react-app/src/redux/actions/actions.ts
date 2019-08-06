import { Action } from "redux";
import { NarrativeData } from '../../pages/Home';

const LOAD = 'LOAD';
export function loadNarratives () {
    console.log()
    return { type: LOAD,
    payload: { }
    }   
}