import React from 'react';
import { connect } from 'react-redux';

import SearchUsers from './SearchUsers';
import { StoreState } from '../../redux/interfaces';

interface AuthData {
    userAuthorization: {
        realname: string;
        roles: Array<string>;
        token: string;
        username: string;
    };
};

export interface Props {
    token: string;
    url: string;
}

const mapStateToProps = (state: StoreState): Props => {
    // Since this component is just a redux wrapper 
    // and not modifying state to make component props
    // simply return state and props
    const {
        auth: {
            userAuthorization
        },
        app: {
            config: {
                services: {
                    UserProfile: {
                        url
                    }
                }
            }
        }
    } = state;

    if (userAuthorization === null) {
        throw new Error('Not authorized');
    }

    const {
        token
    } = userAuthorization;

    return {
        token, url
    };
};

function SearchUsersRedux({ token, url }: Props) {
    return (
        <SearchUsers token={token} url={url} />
    );
};

export default connect(mapStateToProps)(SearchUsersRedux);