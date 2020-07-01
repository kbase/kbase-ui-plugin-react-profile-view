import { connect } from 'react-redux';

import { StoreState } from '../../redux/interfaces';
import WhichComponent from './WhichComponent';

function mapStateToProps(state: StoreState) {
    return {
        narratives: state.narrativeState.narrativeList,
        loading: state.narrativeState.loading,
        isOwner: state.narrativeState.isOwner
    };
};

export default connect(mapStateToProps)(WhichComponent);