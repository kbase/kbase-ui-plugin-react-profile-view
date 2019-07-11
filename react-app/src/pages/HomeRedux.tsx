import { connect } from 'react-redux';

import Home from './Home';
import { StoreState } from '../redux/store';

// interface AppState {
//     app: {
//         config: {
//             baseUrl: string;
//         }
//     };
//     auth: AuthData;
// }

// interface AuthData {
//     userAuthorization: {
//         realname: string;
//         roles: Array<string>;
//         token: string;
//         username: string;
//     }
// }

const mapStateToProps = (state: StoreState) => {
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
};

// function HomeRedux(mapStateToProps:AppState) {
//     return (
//         <Home userData={mapStateToProps.auth.userAuthorization} baseURL={mapStateToProps.app.config.baseUrl}/>
//     )
// }

export default connect(mapStateToProps)(Home);
