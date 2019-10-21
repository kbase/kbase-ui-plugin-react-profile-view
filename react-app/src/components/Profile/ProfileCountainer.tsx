import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import { UserName, ProfileData, StoreState, ProfileView, ErrorMessages } from '../../redux/interfaces';
import { updateProfile } from '../../redux/actions';
import WhichComponent from './WhichComponent';

import { profileFetchStatuses } from '../../redux/fetchStatuses';

interface PropsWithProfileData {
    userName: UserName;
    editEnable: boolean;
    profileData: ProfileData;
    gravatarHash: string;
    profileFetchStatus: string;
};
interface PropsWithoutProfileData {
    profileFetchStatus: string;
};

type Props = PropsWithoutProfileData | PropsWithProfileData | ErrorMessages;

interface DispatchProps {
    updateProfile: (profileData: ProfileData, userName:UserName) => void;
};

interface OwnProps { };

function mapStateToProps(state: StoreState): Props {

    switch (state.profileView.profileFetchStatus) {
        case profileFetchStatuses.NONE:
        case profileFetchStatuses.FETCHING:
            return {
                profileFetchStatus: state.profileView.profileFetchStatus
            };

        case profileFetchStatuses.ERROR:
            let newProps = state.profileView as ErrorMessages
            return {
                errorMessages: newProps.errorMessages,
                profileFetchStatus: state.profileView.profileFetchStatus
            };

        case profileFetchStatuses.SUCCESS:
            // typescript isn't good at switch case yet... 
            let profileData = state.profileView as ProfileView;
            return {
                userName: profileData.userName,
                editEnable: profileData.editEnable,
                profileData: profileData.profileData,
                gravatarHash: profileData.gravatarHash,
                profileFetchStatus: profileData.profileFetchStatus
            };

        default:
            // if you don't return Props type, it will complain. 
            // but if you try to return state.profileView.profileFetchStatus
            // its type is "never" 
            // hacky way to fix that. 
            return {
                profileFetchStatus: profileFetchStatuses.ERROR
            };
    };

};


function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        updateProfile: (profileData: ProfileData, userName:UserName) => {
            return dispatch(updateProfile(profileData, userName) as any);
        }
    };
};

export default connect<Props, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(WhichComponent);
