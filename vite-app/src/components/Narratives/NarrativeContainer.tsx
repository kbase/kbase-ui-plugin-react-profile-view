import { connect } from 'react-redux';

import { StoreState } from '../../redux/interfaces';
import WhichComponent from './WhichComponent';

function mapStateToProps(state: StoreState) {
    const { supplementalBaseState: { uiOrigin }, narrativeState } = state;
    return {
        narrativeState,
        uiOrigin
    };
}

export default connect(mapStateToProps)(WhichComponent);