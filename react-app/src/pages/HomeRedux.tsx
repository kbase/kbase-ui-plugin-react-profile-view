import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import Home from './Home';
import { StoreState } from '../redux/interfaces';
import { sendTitle } from '@kbase/ui-components';
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
    getProfile: (username: string) => void;
    getOrgs: (username: string) => void;
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
                navigation: { params: rawParams },
                devMode
            }
        }
    } = state;
    if (!userAuthorization) {
        throw new Error('This plugin only operates with authentication; no KBase token in store');
    }

    // TODO: fix this in the develop wrapper in kb-components
    let params: UserProfileViewParams;
    if (devMode) {
        const [, username] = document.location.hash.slice(1).split('/');
        params = {
            username
        };
    } else {
        params = (rawParams as unknown) as UserProfileViewParams;
    }
    return {
        token: userAuthorization.token,
        authUsername: userAuthorization.username,
        username: params.username || null,
        baseURL: baseUrl
    };
};

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        loadNarratives: (filter: string, username: string) => {
            return dispatch(loadNarratives(filter, username) as any);
        },
        setTitle: (title: string) => {
            return dispatch(sendTitle(title) as any);
        },
        getProfile: (username: string) => {
            return dispatch(getProfile(username) as any);
        },
        getOrgs: (username: string) => {
            return dispatch(getOrgs(username) as any);
        }
    };
};


export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Home);
