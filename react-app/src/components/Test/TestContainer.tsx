import React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { NarrativeData } from '../../pages/Home';
import { StoreState } from '../../redux/store';
import { loadNarratives, loadNarratives_original } from '../../redux/actions/index';
import { Form, Icon, Input, Button } from 'antd';


interface DispatchProps {
    onSubmitDispatch: () => void;
}


interface StateProps {
    narrativeList: Array<NarrativeData>;
}
type Props = StateProps & DispatchProps 

// this state comes from redux state 
// mapStateToProps is making that redux state into 
// this component's props
function mapStateToProps (state:StoreState):StateProps { 
    /**
     * take narrative out of the state and return as props
     */
    let narrativeList = state.narrativeDataArray 
    return { narrativeList };
};
// //what is returned from this function will be the props
// function mapDispatchToProps(dispatch: Dispatch):DispatchProps {
//     return bindActionCreators<>({ loadNarratives: loadNarratives }, dispatch) 
// }

function mapDispatchToProps(dispatch: Dispatch):DispatchProps {
    return {
                onSubmitDispatch: ()=> {
                dispatch(loadNarratives_original())
            }
    }
}


function MapThatList ( list:Array<NarrativeData> ) {
    console.log(list)
    // return list.map((item) => {
    //         return <li key={item.wsID}>{item.name}</li>
    //     }
    // )
    
};


function TestContainer (props: Props) {
    console.log('testcontainer',props, props.narrativeList)
    function onSubmit(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        props.onSubmitDispatch()

    }
    let narrativeList = mapStateToProps;
    // MapThatList(mapStateToProps);
    return (
        // <ul>{ MapThatList(narrativeList) }</ul>
        <div>pow- <Form onSubmit={onSubmit}><Form.Item><Button htmlType="submit" >push this</Button> </Form.Item></Form></div>
    )
}

export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(TestContainer);