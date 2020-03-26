import { connect } from 'react-redux';

import { StoreState, OrgList, OrgFetchError } from '../../redux/interfaces';
import WhichComponent from './WhichComponent';
import { AsyncFetchStatus } from '../../redux/fetchStatuses';

function mapStateToProps(state: StoreState) {
    switch (state.orgState.orgFetchStatus) {
        case AsyncFetchStatus.NONE:
        case AsyncFetchStatus.FETCHING:
            return {
                orgFetchStatus: state.orgState.orgFetchStatus
            };

        case AsyncFetchStatus.ERROR:
            let orgError = state.orgState as OrgFetchError;
            return {
                errorMessages: orgError.orgError,
                orgFetchStatus: state.orgState.orgFetchStatus,
            };

        // case AsyncFetchStatus.REFETCHING:
        case AsyncFetchStatus.SUCCESS:
            let orgList = state.orgState as OrgList;
            return {
                orgList: orgList.orgList,
                orgFetchStatus: state.orgState.orgFetchStatus
            };

        default:
            return {
                orgFetchStatus: state.orgState.orgFetchStatus
            };
    };
};

export default connect(mapStateToProps)(WhichComponent);