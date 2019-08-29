import React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../../redux/interfaces';
import Orgs from  './Orgs';


function mapStateToProps(state: StoreState) {
    console.log('orgs container', state);
    return {orgList: state.orgState.orgList,  loading: state.orgState.loading};
};

export default connect(mapStateToProps)(Orgs);