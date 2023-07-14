import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import { getProfile, updateProfile } from '../../redux/actions';
import { fetchORCIDId } from '../../redux/actions/orcidActions';
import {
    ORCIDState,
    ProfileState,
    StoreState,
} from '../../redux/interfaces';
import { UserProfileUpdate } from '../../util/API';
import WhichComponent from './WhichComponent';

export type StateProps = {
    profileState: ProfileState
    orcidState: ORCIDState
    baseUrl: string

}

interface DispatchProps {
    updateProfile: (profile: UserProfileUpdate) => void
    checkORCID: (username: string) => void
    fetchProfile: (username: string) => void
}

type OwnProps = Record<string, never>

function mapStateToProps(state: StoreState): StateProps {
    const {
        orcidState,
        profileState,
        supplementalBaseState: {
            uiOrigin
        }
    } = state

    return {
        profileState,
        orcidState,
        baseUrl: uiOrigin
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        updateProfile: (profile: UserProfileUpdate) => {
            return dispatch(updateProfile(profile) as any);
        },
        checkORCID: (username: string) => {
            return dispatch(fetchORCIDId(username) as any)
        },
        fetchProfile: (username: string) => {
            return dispatch(getProfile(username) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(WhichComponent);
