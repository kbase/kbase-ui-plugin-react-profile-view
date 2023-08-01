import { ErrorView, Loading } from '@kbase/ui-components';
import { Component } from 'react';
import { AsyncFetchStatus } from '../../redux/asyncFetchState';
import { ORCIDState, ProfileState } from '../../redux/interfaces';
import { UserProfileUpdate } from '../../util/API';
import Profile from './Profile';

export interface LoaderProps {
    profileState: ProfileState;
    orcidState: ORCIDState;
    baseUrl: string;

    updateProfile: (profile: UserProfileUpdate) => void;
    checkORCID: (username: string) => void;
    fetchProfile: (username: string) => void;

}

export default class Loader extends Component<LoaderProps> {
    render() {
        switch (this.props.profileState.status) {
            case AsyncFetchStatus.NONE:
            case AsyncFetchStatus.FETCHING:
                return <Loading message="Loading..." />
            case AsyncFetchStatus.ERROR: {
                const error = {
                    code: 'error',
                    message: this.props.profileState.error.message
                };
                return <ErrorView error={error} />
            }
            // TODO: what about refetching?
            case AsyncFetchStatus.SUCCESS: {
                const profileView = this.props.profileState.value;
                return <Profile
                    profileView={profileView}
                    orcidState={this.props.orcidState}
                    baseUrl={this.props.baseUrl}
                    updateProfile={this.props.updateProfile}
                    checkORCID={this.props.checkORCID}
                    fetchProfile={this.props.fetchProfile}
                />
            }
        }
    }
}

