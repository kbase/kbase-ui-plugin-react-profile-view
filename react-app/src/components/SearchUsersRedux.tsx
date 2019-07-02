import React from 'react';
import { connect} from 'react-redux';

import SearchUsers from './SearchUsers';
import { Store } from '../pages/Home';

// function mapStateToProps(state:Store) {
//     return state
// }
const mapStateToProps = (state:Store) => {
    return state
}
function SearchUsersRedux(mapStateToProps:Store) {
    return (
        <SearchUsers token={mapStateToProps.token} hostName={mapStateToProps.hostName}/>
    )
}

export default connect(mapStateToProps)(SearchUsersRedux);