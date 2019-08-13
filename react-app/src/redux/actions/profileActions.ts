import { ThunkDispatch } from "redux-thunk";
import { StoreState } from "../interfaces";
import { Action, AnyAction, Dispatch } from 'redux';
import { fetchOrgsOfProfileAPI, fetchProfileAPI, fetchNarrativesAPI } from '../../util/API';

const LOAD_PROFILE = 'LOAD_PROFILE';

export function loadProfile() {
    
}