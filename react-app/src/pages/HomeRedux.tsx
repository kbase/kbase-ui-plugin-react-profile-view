import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import Home from './Home';
import { StoreState } from '../redux/interfaces';
import { sendTitle } from '@kbase/ui-lib';
import { loadNarratives, getProfile, getOrgs } from '../redux/actions';

interface OwnProps { };

interface StateProps {
    token: string;
    authUsername: string;
    username: string | null;
    baseURL: string;
};

interface DispatchProps {
    setTitle: (title: string) => void;
    loadNarratives: (filter: string, profileID: string) => void;
    getProfile: (profileID: string) => void;
    getOrgs: (profileID: string) => void;
};

// TODO this should be part of the view definition
interface UserProfileViewParams {
    username?: string;
};

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
    console.log('baseUrl', baseUrl)
    return {
        token: userAuthorization.token,
        authUsername: userAuthorization.username,
        username: params.username || null,
        baseURL: baseUrl
    };
};

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        loadNarratives: (filter: string, profileID: string) => {
            return dispatch(loadNarratives(filter, profileID) as any);
        },
        setTitle: (title: string) => {
            return dispatch(sendTitle(title) as any);
        },
        getProfile: (profileID: string) => {
            return dispatch(getProfile(profileID) as any);
        },
        getOrgs: (profileID: string) => {
            return dispatch(getOrgs(profileID) as any);
        }
    };
};


export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Home);
