import React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../../redux/interfaces';
import Narratives from './Narratives';



function mapStateToProps (state: StoreState) { 
    // Since this component is just a redux wrapper 
    // and not modifying state to make component props
    // simply return state as props
    return state 
}

function NarrativeContainer (mapStateToProps:StoreState) {
    return (
        <Narratives 
            narratives={mapStateToProps.narrativeSate.narrativeDataArray} 
            loading={mapStateToProps.narrativeSate.loading}
        />
    )
}

export default connect(mapStateToProps)(NarrativeContainer);