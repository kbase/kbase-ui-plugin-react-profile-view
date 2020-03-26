import React from 'react';
import { Form, Input } from 'antd';
import { UserName, ProfileUserdata } from '../../../redux/interfaces';

const { TextArea } = Input;

const DEFAULT_MIN_TEXT_LENGTH = 0;
const DEFAULT_MAX_TEXT_LENGTH = 4000;

interface Props {
    hidden: boolean;
    required?: boolean;
    userName: UserName;
    updateStoreState: (data: ProfileUserdata, userName: UserName) => void;
    data: any;
    stateProperty: string;
    placeHolder?: string;
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
 *  - Validation status will be shown.
 *  - If onBlur/onPressEnter updates storeState, set it to true.
 *  - minLength default = 2
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
    }

    // componentDidMount() {
    // };

    // componentDidUpdate(prevProps: Props, prevState: State, snapshot: any) {
    // };

    /**
     * Validate value against 
     *  - max and min length
     *  - if it's required field
     *  - input type 
     * and set state per validation result.
     * @param inputValue 
     */
    validateInput(inputValue: string) {
        // check against min and max length

        let status: State['validateStatus'];
        let helper: string | undefined;
        const maxLength = this.props.maxLength || DEFAULT_MAX_TEXT_LENGTH;
        const minLength = this.props.minLength || DEFAULT_MIN_TEXT_LENGTH;

        if (!this.props.required && inputValue.length === 0) {
            status = 'success';
            helper = undefined;
        } else if (inputValue.length <= maxLength && inputValue.length >= minLength) {
            status = 'success';
            helper = undefined;
        } else if (inputValue.length < minLength) {
            status = 'error';
            helper = 'input must be at least ' + minLength + ' characters';
        } else if (inputValue.length > maxLength) {
            // this shouldn't happen since input field max length is set
            status = 'error';
            helper = 'input must be less than ' + maxLength + ' characters';
        };

        this.setState({ validateStatus: status, helpText: helper });
    }

    /**
     * When data has been changed and input validation is success,
     * calls upstateStoreState to update store state. 
     * If input is not required, clears help text. 
     * @param event 
     */
    updateStoreStateProperty(event: React.FocusEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) {
        if (!this.props.required) {
            this.setState({ helpText: undefined });
        };
        // any is used to use generic property 
        let data: any = this.props.data;
        if (this.state.validateStatus === 'success' && data[this.props.stateProperty] !== this.state.inputValue) {
            data[this.props.stateProperty] = this.state.inputValue;
            this.props.updateStoreState(data, this.props.userName);
        };
    }

    /**
     * Save/update input value to state
     * @param event 
     */
    saveLocalState(value: string) {
        this.setState({ inputValue: value.trim() });
    }

    /**
     * handle on change event
     * call saveLocalState function & validateInput function
     * @param event 
     */
    handleOnChange(event: React.ChangeEvent<HTMLTextAreaElement> | React.FocusEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) {
        const inputValue = event.currentTarget.value;
        // validate input only when it's not readOnly
        if (!this.props.readOnly) {
            this.validateInput(inputValue);
        };
        if (typeof inputValue === 'string') {
            this.saveLocalState(inputValue);
        };
    }

    render() {
        return (
            <Form.Item hasFeedback help={this.state.helpText} validateStatus={this.state.validateStatus}>
                <TextArea
                    autoSize
                    hidden={this.props.hidden}
                    placeholder={this.props.placeHolder}
                    readOnly={this.props.readOnly}
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
    }
};

export default TextAreaForm;
