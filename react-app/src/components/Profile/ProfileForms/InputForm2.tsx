import React from 'react';
import { Form, Input } from 'antd';
import { UserName, ProfileUserdata } from '../../../redux/interfaces';

const DEFAULT_MAX_INPUT_LENGTH = 10000;
const DEFAULT_MIN_INPUT_LENGTH = 2;

interface Props {
    hidden: boolean;
    type: string;
    required?: boolean;
    userName: UserName;
    label: string;
    updateStoreState: (userdata: ProfileUserdata, userName: UserName) => void;
    data: any;
    stateProperty: string;
    placeHolder?: string;
    defaultValue?: string | undefined;
    readOnly: boolean;
    maxLength?: number;
    minLength?: number;
    onBlur?: boolean | undefined; // when true, it updates store state
    onPressEnter?: boolean | undefined; // when true, it updates store state
};

interface State {
    inputValue: string | undefined;
    validateStatus?: "" | "error" | "success" | "warning" | "validating" | undefined;
    helpText: string | undefined;
    requiredNotification: boolean | undefined;
};

/**
 * Input field wrapped in Form, Form.item. 
 *  - Validation status will be shown.
 *  - If onBlur/onPressEnter updates storeState, set it to true.
 *  - minLength default = 2
 */
export default class InputForm2 extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            inputValue: undefined,
            validateStatus: undefined,
            helpText: undefined,
            requiredNotification: undefined
        };

        this.validateInput = this.validateInput.bind(this);
        this.updateStoreStateProperty = this.updateStoreStateProperty.bind(this);
        this.saveLocalState = this.saveLocalState.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.requiredNotificationControl = this.requiredNotificationControl.bind(this);
    };

    componentDidMount() {
        this.setState({ requiredNotification: this.props.required });
    };

    requiredNotificationControl() {
        if (this.props.required && !this.props.readOnly) {
            return true;
        } else if (this.state.validateStatus === 'success') {
            return false;
        } else {
            return false;
        };
    };

    /**
     * Validate value against 
     *  - max and min length
     *  - if it's a required field
     *  - input type 
     * and set state per validation result.
     * @param inputValue 
     */
    validateInput(inputValue: string) {
        // When type is number, then check if it's a number first
        if (this.props.type === "number" && isNaN(parseInt(inputValue, 10))) {
            this.setState({ validateStatus: 'error', helpText: 'Expecting numbers' });
            return;
        }

        const maxLength = typeof this.props.maxLength === 'undefined' ? DEFAULT_MAX_INPUT_LENGTH : this.props.maxLength;
        const minLength = typeof this.props.minLength === 'undefined' ? DEFAULT_MIN_INPUT_LENGTH : this.props.minLength;

        if (inputValue.length <= maxLength && inputValue.length >= minLength) {
            this.setState({
                validateStatus: 'success',
                helpText: undefined,
                requiredNotification: false
            });
        } else if (!this.props.required && inputValue.length === 0) {
            this.setState({
                validateStatus: 'success',
                helpText: undefined,
                requiredNotification: false
            });
        } else if (inputValue.length < minLength) {
            this.setState({
                validateStatus: 'error',
                helpText: 'input must be at least ' + minLength + ' characters'
            });
        } else if (inputValue.length > maxLength) {
            // this shouldn't happen since input field max length is set
            this.setState({
                validateStatus: 'error',
                helpText: 'input must be less than ' + maxLength + ' characters'
            });
        };
    };

    /**
     * When data has been changed and input validation is success,
     * calls upstateStoreState to update store state. 
     * If input is not required, clears help text. 
     * @param event 
     */
    updateStoreStateProperty(event: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) {
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
    handleOnChange(event: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) {
        let inputValue = event.currentTarget.value;
        if (this.props.readOnly) {
            return;
        } else {
            if (typeof inputValue === 'string') {
                this.saveLocalState(inputValue);
                this.validateInput(inputValue);
            };
        };
    };

    render() {
        return (
            <Form.Item
                required={this.state.requiredNotification}
                label={this.props.label}
                // hasFeedback help={this.state.helpText}
                validateStatus={this.state.validateStatus}
                style={{ display: this.props.hidden ? 'none' : 'block' }}
            >
                <Input
                    placeholder={this.props.placeHolder}
                    readOnly={this.props.readOnly}
                    maxLength={this.props.maxLength}
                    minLength={this.props.minLength}
                    onBlur={this.props.onBlur === true ? this.updateStoreStateProperty : this.handleOnChange}
                    onPressEnter={this.props.onPressEnter === true ? this.updateStoreStateProperty : this.handleOnChange}
                    onChange={this.handleOnChange}
                    defaultValue={this.props.defaultValue}
                />
            </Form.Item>
        );
    };
};
