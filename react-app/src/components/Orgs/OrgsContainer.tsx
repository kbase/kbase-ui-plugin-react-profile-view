import React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../../redux/interfaces';
import Orgs from  './Orgs';


function mapStateToProps(state: StoreState) {
    // Since this component is just a redux wrapper 
    // and not modifying state to make component props
    // simply return state as props
    console.log(state)
    return state
}

function OrgsContainer(mapStateToProps:StoreState){
    return <Orgs orgList={mapStateToProps.orgState.orgList} loading={mapStateToProps.orgState.loading} />
}

export default connect(mapStateToProps)(OrgsContainer);