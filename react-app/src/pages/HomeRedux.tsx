import React from 'react';
import { connect } from 'react-redux';

import Home from './Home';

interface AppState {
    app: {
        config: {
            baseUrl: string;
        }
    };
    auth: AuthData;
}

interface AuthData {
    userAuthorization: {
        realname: string;
        roles: Array<string>;
        token: string;
        username: string;
    }
}

const mapStateToProps = (state:AppState) => {
    console.log(state)
    return state
}

function HomeRedux(mapStateToProps:AppState) {
    return (
        <Home userData={mapStateToProps.auth.userAuthorization} baseURL={mapStateToProps.app.config.baseUrl}/>
    )
}

export default connect(mapStateToProps)(HomeRedux);