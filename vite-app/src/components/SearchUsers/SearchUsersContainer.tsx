import { connect } from 'react-redux';

import { AuthenticationStatus } from '@kbase/ui-lib';
import { StoreState } from '../../redux/interfaces';
import SearchUsers from './SearchUsers';

// interface AuthData {
//     userAuthorization: {
//         realname: string;
//         roles: Array<string>;
//         token: string;
//         username: string;
//     };
// }

export interface Props {
    token: string;
    url: string;
}

const mapStateToProps = (state: StoreState): Props => {
    // Since this component is just a redux wrapper 
    // and not modifying state to make component props
    // simply return state and props
    const {
        authentication,
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

    if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
        throw new Error('Not authorized');
    }

    const {
        userAuthentication: {
            token
        }
    } = authentication;

    return {
        token, url
    };
};

function SearchUsersRedux({ token, url }: Props) {
    return (
        <SearchUsers token={token} url={url} />
    );
}

export default connect(mapStateToProps)(SearchUsersRedux);