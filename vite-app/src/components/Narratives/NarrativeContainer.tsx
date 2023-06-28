import { connect } from 'react-redux';

import { StoreState } from '../../redux/interfaces';
import WhichComponent from './WhichComponent';

function mapStateToProps(state: StoreState) {
    const { narrativeState } = state;
    return {
        narrativeState
    };
}

export default connect(mapStateToProps)(WhichComponent);