import React from 'react';
import { connect } from 'react-redux';

import Home from './Home';
import { Store } from '../pages/Home';

const mapStateToProps = (state:Store) => {
    console.log(state)
    return state
}
function HomeRedux(mapStateToProps:Store) {
    return (
        <Home loggedInUser={mapStateToProps.loggedInUser} token={mapStateToProps.token} hostName={mapStateToProps.hostName}/>
    )
}

export default connect(mapStateToProps)(HomeRedux);