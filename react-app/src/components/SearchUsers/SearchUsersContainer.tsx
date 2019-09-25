import React from 'react';
import { connect } from 'react-redux';

import SearchUsers from './SearchUsers';

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

const mapStateToProps = (state: AppState) => {
    // Since this component is just a redux wrapper 
    // and not modifying state to make component props
    // simply return state asd props
    return state
}
function SearchUsersRedux(mapStateToProps: AppState) {
    return (
        <SearchUsers token={mapStateToProps.auth.userAuthorization.token} baseURL={mapStateToProps.app.config.baseUrl} />
    )
}

export default connect(mapStateToProps)(SearchUsersRedux);