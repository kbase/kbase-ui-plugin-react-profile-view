import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import { updateProfile } from '../../redux/actions';
import { fetchORCIDId } from '../../redux/actions/orcidActions';
import {
    ORCIDState,
    ProfileState,
    StoreState,
} from '../../redux/interfaces';
import { UserProfileUpdate } from '../../util/API';
import WhichComponent from './WhichComponent';

export type Props = {
    profileState: ProfileState,
    orcidState: ORCIDState
}

interface DispatchProps {
    updateProfile: (profile: UserProfileUpdate) => void;
    checkORCID: (username: string) => void;
}

type OwnProps = Record<string, never>

function mapStateToProps(state: StoreState): Props {
    const {
        orcidState,
        profileState
    } = state;

    return {
        profileState,
        orcidState
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        updateProfile: (profile: UserProfileUpdate) => {
            return dispatch(updateProfile(profile) as any);
        },
        checkORCID: (username: string) => {
            return dispatch(fetchORCIDId(username) as any)
        }
    };
}

export default connect<Props, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(WhichComponent);
