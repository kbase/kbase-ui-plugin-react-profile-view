import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NarrativeData } from '../../pages/Home';
import { StoreState } from '../../redux/store';
import { loadNarratives, loadNarratives_original } from '../../redux/actions/index';
import { Form, Button } from 'antd';
import { string } from 'prop-types';


interface DispatchProps {
    onSubmitDispatch: (filter:string) => void;
    onSubmitDispatchThat: () => void;
}


interface StateProps {
    narrativeList: Array<NarrativeData>;
}

// props has to be combination os state and dispatch
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

function mapDispatchToProps(dispatch: Dispatch):DispatchProps {
    return {
        onSubmitDispatch: () =>  dispatch(loadNarratives('public') as any), // cuz I can't figure it out. 
        onSubmitDispatchThat: () => dispatch(loadNarratives_original())
    }
}

// View Component itself 
function TestContainer (props: Props) {
    console.log('testcontainer',props, props.narrativeList)
    // submit button is not aware of dispatch. 
    // It just calls onSumbit function. 
    function onSubmit(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        props.onSubmitDispatch('public')
    }
    function onSubmitThat(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        props.onSubmitDispatchThat()
    }
    let narrativeList = mapStateToProps;
    // MapThatList(mapStateToProps);
    return (
        // <ul>{ MapThatList(narrativeList) }</ul>
        <div>pow- <Form onSubmit={onSubmit}><Form.Item><Button htmlType="submit" >push this</Button> </Form.Item></Form>
        pow- <Form onSubmit={onSubmitThat}><Form.Item><Button htmlType="submit" >push that</Button> </Form.Item></Form></div>
    )
}

export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(TestContainer);