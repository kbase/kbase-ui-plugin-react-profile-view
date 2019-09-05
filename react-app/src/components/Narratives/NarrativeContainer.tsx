import React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../../redux/interfaces';
import Narratives from './Narratives';



function mapStateToProps (state: StoreState) { 
    console.log('narrativeState', state);
    return {narratives: state.narrativeState.narrativeList, loading: state.narrativeState.loading};
};


export default connect(mapStateToProps)(Narratives);