import { connect } from 'react-redux';

import Home from './Home';

import { StoreState } from '../redux/store';
import { Action, Dispatch } from 'redux';
import { setTitle } from '@kbase/ui-lib';

interface OwnProps {}

interface StateProps {
    token: string;
    username: string;
    baseURL: string;
}

interface DispatchProps {
    setTitle: (title: string) => void;
}

function mapStateToProps(state: StoreState, ownProps: OwnProps): StateProps {
    const {
        auth: { userAuthorization },
        app: {
            config: { baseUrl }
        }
    } = state;
    if (!userAuthorization) {
        throw new Error('This plugin only operates with authentication; no KBase token in store');
    }
    return {
        token: userAuthorization.token,
        username: userAuthorization.username,
        baseURL: baseUrl
    };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        setTitle: (title: string) => {
            return dispatch(setTitle(title) as any);
        }
    };
}

// function HomeRedux(mapStateToProps:AppState) {
//     return (
//         <Home userData={mapStateToProps.auth.userAuthorization} baseURL={mapStateToProps.app.config.baseUrl}/>
//     )
// }

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Home);
