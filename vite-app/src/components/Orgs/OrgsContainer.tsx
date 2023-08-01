import { connect } from 'react-redux';

import { StoreState } from '../../redux/interfaces';
import WhichComponent from './WhichComponent';

function mapStateToProps(state: StoreState) {
    const { orgsState } = state;
    return { orgsState }
}

export default connect(mapStateToProps)(WhichComponent);
