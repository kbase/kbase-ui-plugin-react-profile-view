import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import Home from './Home';
import { StoreState, NarrativeData } from '../redux/interfaces';
import { sendTitle } from '@kbase/ui-lib';
import { loadNarratives, loadProfile, updateProfile } from '../redux/actions/index';


interface OwnProps {}

interface StateProps {
    token: string;
    authUsername: string;
    username: string | null;
    baseURL: string;
}

interface DispatchProps {
    setTitle: (title: string) => void;
    loadNarratives: (filter:string, profileID: string) => void;
    loadProfile: (profileID: string) => void;
    updateProfile: (profileID: string) => void;
}

// TODO this should be part of the view definition
interface UserProfileViewParams {
    username?: string;
}

function mapStateToProps(state: StoreState, ownProps: OwnProps): StateProps {
    const {
        auth: { userAuthorization },
        app: {
            config: { baseUrl },
            runtime: {
                navigation: { params: rawParams }
            }
        }
    } = state;
    if (!userAuthorization) {
        throw new Error('This plugin only operates with authentication; no KBase token in store');
    }
    const params = (rawParams as unknown) as UserProfileViewParams;
    return {
        token: userAuthorization.token,
        authUsername: userAuthorization.username,
        username: params.username || null,
        baseURL: baseUrl
    };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        // action creator loadNarratives is passed as props to the home page.
        loadNarratives: (filter: string, profileID: string) => {
            return dispatch(loadNarratives(filter, profileID) as any);
        },
        setTitle: (title: string) => {
            return dispatch(sendTitle(title) as any);
        },
        updateProfile: (profileID: string) => {
            return dispatch(updateProfile(profileID) as any);
        },
        loadProfile: (profileID: string) => {
            return dispatch(loadProfile(profileID) as any);
        }
    
    };
}


export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Home);
