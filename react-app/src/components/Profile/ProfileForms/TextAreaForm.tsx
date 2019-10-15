import React from 'react';
import { Form, Input } from 'antd';
import { UserName } from '../../../redux/interfaces';

const { TextArea } = Input;

interface Props {
    hidden: boolean;
    type: string;
    required: boolean;
    userName: UserName;
    updateStoreState: (data: any, userName: UserName) => void;
    data: any;
    stateProperty: string;
    placeHolder?: string
    defaultValue?: string | undefined;
    readOnly: boolean;
    maxLength?: number;
    minLength?: number;
    onBlur: boolean | undefined; // when true, it updates store state
    onPressEnter?: boolean | undefined; // when true, it updates store state
};

interface State {
    inputValue: string | undefined;
    validateStatus?: "" | "error" | "success" | "warning" | "validating" | undefined;
    helpText: string | undefined;
};

/**
 * Input field wrapped in Form, Form.item. 
 * Validation status will be shown.
 * If onBlur/onPressEnter updates storeState, set it to true.
 * minLength default = 2
 */

class TextAreaForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            inputValue: undefined,
            validateStatus: undefined,
            helpText: undefined
        };

        this.validateInput = this.validateInput.bind(this);
        this.updateStoreStateProperty = this.updateStoreStateProperty.bind(this);
        this.saveLocalState = this.saveLocalState.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    };

    componentDidMount() {
    };

    componentDidUpdate(prevProps: Props, prevState: State, snapshot: any) {
    };

    /**
     * Validate value against 
     *  - max and min length
     *  - if it's required field
     *  - type 
     * and set state per validation result.
     * @param inputValue 
     */
    validateInput(inputValue: string) {
        // When type is number, then check if it's a number first
        if (this.props.type === "number" && isNaN(parseInt(inputValue, 10))) {
            this.setState({ validateStatus: 'error', helpText: 'Expecting numbers' });
            return;
        };
        // check against min and max length
        if (typeof this.props.maxLength !== 'undefined') {
            let foo: State['validateStatus'];
            let helper: string | undefined;
            let maxLength = this.props.maxLength;
            // this could be ternary operator, but typescript doesn't like it.
            let minLength = 2;
            if (typeof this.props.minLength !== 'undefined') minLength = this.props.minLength;

            if (inputValue.length <= maxLength && inputValue.length >= minLength) {
                foo = 'success';
                helper = undefined;
            } else if (!this.props.required && inputValue.length === 0) {
                foo = 'success';
                helper = undefined;
            } else if (inputValue.length < minLength) {
                foo = 'error';
                helper = 'input must be at least ' + minLength + ' characters';
            } else if (inputValue.length > maxLength) {
                // this shouldn't happen since input field max length is set
                foo = 'error';
                helper = 'input must be less than ' + maxLength + ' characters';
            };

            this.setState({ validateStatus: foo, helpText: helper });
        };
    };

    /**
     * When data has been changed and input validation is success,
     * calls upstateStoreState to update store state. 
     * If input is not required, clears help text. 
     * @param event 
     */
    updateStoreStateProperty(event: React.FocusEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) {
        // console.log(data)
        if (!this.props.required) {
            this.setState({ helpText: undefined });
        };
        // any is used to use generic property 
        let data: any = this.props.data;
        if (this.state.validateStatus === 'success' && data[this.props.stateProperty] !== this.state.inputValue) {
            data[this.props.stateProperty] = this.state.inputValue;
            this.props.updateStoreState(data, this.props.userName);
        };
    };

    /**
     * Save/update input value to state
     * @param event 
     */
    saveLocalState(value: string) {
        this.setState({ inputValue: value.trim() });
    };

    /**
     * handle on change event
     * call saveLocalState function & validateInput function
     * @param event 
     */
    handleOnChange(event: React.ChangeEvent<HTMLTextAreaElement> | React.FocusEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) {
        let inputValue = event.currentTarget.value;
        // validate input only when it's not readOnly
        if(!this.props.readOnly){
            this.validateInput(inputValue);
        };
        if (typeof inputValue === 'string') {
            this.saveLocalState(inputValue);
        };
    };

    render() {
        return (
                <Form.Item hasFeedback help={this.state.helpText} validateStatus={this.state.validateStatus}>
                    <TextArea
                        autosize
                        hidden={this.props.hidden}
                        placeholder={this.props.placeHolder}
                        readOnly={this.props.readOnly}
                        className="clear-disabled"
                        style={{ minHeight: "40px" }}
                        maxLength={this.props.maxLength}
                        minLength={this.props.minLength}
                        onFocus={this.handleOnChange}
                        onBlur={this.props.onBlur === true ? this.updateStoreStateProperty : this.handleOnChange}
                        onPressEnter={this.props.onPressEnter === true ? this.updateStoreStateProperty : this.handleOnChange}
                        onChange={this.handleOnChange}
                        defaultValue={this.props.defaultValue}
                    />
                </Form.Item>
        );
    };
};

export default TextAreaForm;
