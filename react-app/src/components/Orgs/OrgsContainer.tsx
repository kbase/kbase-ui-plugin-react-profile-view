import React from 'react';
import { connect } from 'react-redux';

import { StoreState, OrgList } from '../../redux/interfaces';
import WhichComponent from './WhichComponent';
import { orgFetchStatuses } from '../../redux/fetchStatuses';

function mapStateToProps(state: StoreState) {
    switch (state.orgState.orgFetchStatus) {
        case orgFetchStatuses.NONE:
        case orgFetchStatuses.FETCHING:
            return {
                orgFetchStatus: state.orgState.orgFetchStatus
            };
            break;

        case orgFetchStatuses.ERROR:
            return {
                orgFetchStatus: state.orgState.orgFetchStatus
            };
            break;

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
            break;
    };
};

export default connect(mapStateToProps)(WhichComponent);