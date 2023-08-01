import { ErrorView, Loading } from '@kbase/ui-components';
import { AsyncProcessStatus } from '@kbase/ui-lib';
import { Component } from 'react';
import { NarrativesState } from '../../redux/interfaces'; //interface
import Narratives from './Narratives';

interface LoaderProps {
    narrativeState: NarrativesState,
    uiOrigin: string;
}

export default class Loader extends Component<LoaderProps> {
    render() {
        switch (this.props.narrativeState.status) {
            case AsyncProcessStatus.NONE:
            case AsyncProcessStatus.PENDING:
                return <Loading message="Loading..." />
            case AsyncProcessStatus.ERROR: {
                const error = {
                    code: 'error',
                    message: this.props.narrativeState.error.message
                };
                return <ErrorView error={error} />
            }
            case AsyncProcessStatus.SUCCESS: {
                const { isOwner, narrativesList } = this.props.narrativeState.value;
                return <Narratives
                    narratives={narrativesList}
                    isOwner={isOwner}
                    loading={false}
                    uiOrigin={this.props.uiOrigin}
                />
            }
        }
    }
}