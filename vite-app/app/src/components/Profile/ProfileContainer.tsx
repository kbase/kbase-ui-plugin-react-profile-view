import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import { updateProfile } from '../../redux/actions';
import {
    ErrorMessages,
    ProfileUserdata,
    ProfileView,
    StoreState,
    UserName
} from '../../redux/interfaces';
import WhichComponent from './WhichComponent';

import { AsyncFetchStatus } from '../../redux/fetchStatuses';

interface PropsWithProfileData {
    userName: UserName;
    editEnable: boolean;
    profileData: ProfileUserdata;
    gravatarHash: string;
    profileFetchStatus: string;
}
interface PropsWithoutProfileData {
    profileFetchStatus: string;
}

type Props = PropsWithoutProfileData | PropsWithProfileData | ErrorMessages;

interface DispatchProps {
    updateProfile: (profileUserdata: ProfileUserdata, userName: UserName) => void;
}

interface OwnProps { }

function mapStateToProps(state: StoreState): Props {

    switch (state.profileView.profileFetchStatus) {
        case AsyncFetchStatus.NONE:
        case AsyncFetchStatus.FETCHING:
            return {
                profileFetchStatus: state.profileView.profileFetchStatus
            };

        case AsyncFetchStatus.ERROR: {
            const newProps = state.profileView as ErrorMessages;
            return {
                errorMessages: newProps.errorMessages,
                profileFetchStatus: state.profileView.profileFetchStatus
            };
        }

        case AsyncFetchStatus.REFETCHING:
        case AsyncFetchStatus.SUCCESS: {
            const profileData = state.profileView as ProfileView;
            return {
                userName: profileData.userName,
                editEnable: profileData.editEnable,
                profileData: profileData.profileUserdata,
                gravatarHash: profileData.gravatarHash,
                profileFetchStatus: profileData.profileFetchStatus
            };
        }

        default:
            return {
                profileFetchStatus: AsyncFetchStatus.ERROR
            };
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        updateProfile: (profileUserdata: ProfileUserdata) => {
            return dispatch(updateProfile(profileUserdata) as any);
        }
    };
}

export default connect<Props, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(WhichComponent);
