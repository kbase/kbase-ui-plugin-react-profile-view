import React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../../redux/interfaces';
import WhichComponent from './WhichComponent';

function mapStateToProps(state: StoreState) {
    console.log('orgs container', state);
    return { orgList: state.orgState.orgList };
};

export default connect(mapStateToProps)(WhichComponent);