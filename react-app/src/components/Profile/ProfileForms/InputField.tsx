import React from 'react';
import { Form, Input } from 'antd';


interface Props {
    userID: string;
    updateStoreState: (userID: string, data:any)=>void;
    data: any;
    stateProperty: string;
    placeHolder?: string
    defaultValue : string | undefined;
    readOnly: boolean;
    maxLength?: number;
    onBlur?: boolean | undefined; // when true, it updates store state
    onPressEnter? : boolean | undefined; // when true, it updates store state
};

interface State {
    inputValue: string | undefined;
    validateStatus?: "" | "error" | "success" | "warning" | "validating" | undefined
};

/**
 * Input field wrapped in Form, Form.item. 
 * 
 * 
 * if event listener updates storeState, set to true
 */

class InputField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state ={
            inputValue: undefined,
            validateStatus: undefined
        };
        this.validateInput = this.validateInput.bind(this);
        this.updateStoreStateProperty = this.updateStoreStateProperty.bind(this);
        this.saveLocalState = this.saveLocalState.bind(this)
    };

    componentDidMount() {

    };

    componentDidUpdate(prevProps: Props, prevState: State, snapshot: any){
        // console.log(this.state)
    };

    // validation function
    validateInput(inputValue:string) {
        let foo:State['validateStatus'] = 'success'
        this.setState({ validateStatus: foo})
    };

    // update storeState
    updateStoreStateProperty(event: any ) {
        let data: any = this.props.data;
        data[this.props.stateProperty] = this.state.inputValue;
        console.log(data)
        this.props.updateStoreState(this.props.userID, data);
    };

    /**
     * Save/update input value and validateStatus
     * @param event 
     */
    saveLocalState(event: any) {
        let inputValue = event.target.value;
        if( typeof inputValue === 'string'){
            let newState: any = { [this.props.stateProperty]: inputValue.trim() };
            this.validateInput(inputValue)
            // this.setState(newState);
            this.setState({ inputValue: inputValue.trim(), validateStatus: this.state.validateStatus  });
        };
    };


    render() {
        return (
                <Form>
                <Form.Item validateStatus={this.state.validateStatus}>
                    <Input
                        placeholder={this.props.placeHolder}
                        readOnly={this.props.readOnly}
                        className="clear-disabled margin10px"
                        style={{ minHeight: "40px"}}
                        maxLength={this.props.maxLength}
                        onBlur={this.props.onBlur === true ? this.updateStoreStateProperty : this.saveLocalState}
                        onPressEnter={this.props.onPressEnter === true ? this.updateStoreStateProperty : this.saveLocalState }
                        onChange={this.saveLocalState}
                        defaultValue={this.props.defaultValue}
                    />
                </Form.Item>
                </Form>
        );
    };
};

export default InputField;
