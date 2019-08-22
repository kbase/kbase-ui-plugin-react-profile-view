import React from 'react';
import { connect } from 'react-redux';

import { NarrativeData, StoreState } from '../../redux/interfaces';
import Narratives from './Narratives';



function mapStateToProps (state: StoreState) { 
    console.log("narrativeContainer", state)
    let narratives = state.narrativeDataArray
    // Since this component is just a redux wrapper 
    // and not modifying state to make component props
    // simply return state as props
    return state 
}
//TODO: AKIYO narrative loading 
function NarrativeContainer (mapStateToProps:StoreState) {
    console.log('load NarrativeContainer', mapStateToProps.narrativeDataArray)
    return (
        <Narratives 
            narratives={mapStateToProps.narrativeDataArray} 
            narrativesloaded={true}
        />
    )
}

export default connect(mapStateToProps)(NarrativeContainer);