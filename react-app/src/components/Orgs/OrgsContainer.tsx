import React from 'react';
import { connect } from 'react-redux';

import { StoreState, OrgList, OrgFetchError } from '../../redux/interfaces';
import WhichComponent from './WhichComponent';
import { orgFetchStatuses } from '../../redux/fetchStatuses';

function mapStateToProps(state: StoreState) {
    switch (state.orgState.orgFetchStatus) {
        case orgFetchStatuses.NONE:
        case orgFetchStatuses.FETCHING:
            return {
                orgFetchStatus: state.orgState.orgFetchStatus
            };

        case orgFetchStatuses.ERROR:
            let orgError = state.orgState as OrgFetchError
            return {
                errorMessages: orgError.orgError,
                orgFetchStatus: state.orgState.orgFetchStatus,
            };

        case orgFetchStatuses.SUCCESS:
            let orgList = state.orgState as OrgList
            return {
                orgList: orgList.orgList,
                orgFetchStatus: state.orgState.orgFetchStatus
            }

        default:
            return {
                orgFetchStatus: state.orgState.orgFetchStatus
            };
    };
};

export default connect(mapStateToProps)(WhichComponent);