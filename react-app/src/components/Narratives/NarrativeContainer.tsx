import React from 'react';
import { connect } from 'react-redux';

import { NarrativeData } from '../../pages/Home';
import Narratives from './Narratives';


interface State {
    narratives: Array<NarrativeData>;
    narrativesloaded: Boolean;
}
function mapStateToProps (state: State) { 
    console.log(state)
    // Since this component is just a redux wrapper 
    // and not modifying state to make component props
    // simply return state as props
    return state 
}

function NarrativeContainer (mapStateToProps:State) {
    return (
        <Narratives 
            narratives={mapStateToProps.narratives} 
            narrativesloaded={mapStateToProps.narrativesloaded}
        />
    )
}

export default connect(mapStateToProps)(NarrativeContainer);