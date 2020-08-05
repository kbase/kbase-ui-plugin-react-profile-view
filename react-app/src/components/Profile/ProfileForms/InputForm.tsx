import React from 'react';
import { Form, Input } from 'antd';
import { DEFAULT_MIN_INPUT_LENGTH, DEFAULT_MAX_INPUT_LENGTH } from '../../../constants';

interface Props {
    hidden: boolean;
    type: string;
    required?: boolean;
    label: string;
    updateProfileField: (value: string) => void;
    placeHolder?: string;
    defaultValue?: string;
    value?: string;
    maxLength?: number;
    minLength?: number;
};

interface State {
    status: "" | "error" | "success" | "warning" | "validating" | null;
    helpText: string | null;
    requiredNotification: boolean | null;
    currentValue: string;
    committedValue: string;
    dirty: boolean;
};

/**
 * Input field wrapped in Form, Form.item. 
 *  - Validation status will be shown.
 *  - If onBlur/onPressEnter updates storeState, set it to true.
 *  - minLength default = 2
 */
export default class InputForm3 extends React.Component<Props, State> {
    savedValue: string;
    constructor(props: Props) {
        super(props);
        this.state = {
            currentValue: this.props.value || '',
            committedValue: this.props.value || '',
            status: null,
            dirty: false,
            helpText: null,
            requiredNotification: null
        };
        this.savedValue = props.defaultValue || '';
    }

    componentDidMount() {
        this.setState({ requiredNotification: this.props.required || false });
        this.validate(this.state.currentValue);
    }

    /**
     * Validate value against 
     *  - max and min length
     *  - if it's a required field
     *  - input type 
     * and set state per validation result.
     * @param inputValue 
     */
    validate(inputValue: string) {
        const minLength = typeof this.props.minLength === 'undefined' ? DEFAULT_MIN_INPUT_LENGTH : this.props.minLength;
        const maxLength = typeof this.props.maxLength === 'undefined' ? DEFAULT_MAX_INPUT_LENGTH : this.props.maxLength;

        if (this.props.required && (!inputValue || inputValue.length === 0)) {
            this.setState({
                status: 'error',
                helpText: 'input is required for this field'
            });
            return false;
        }

        if (inputValue.length < minLength) {
            this.setState({
                status: 'error',
                helpText: 'input must be at least ' + minLength + ' characters'
            });
            return false;
        }

        if (inputValue.length > maxLength) {
            // this shouldn't happen since input field max length is set
            this.setState({
                status: 'error',
                helpText: 'input must be less than ' + maxLength + ' characters'
            });
            return false;
        }

        this.setState({
            status: 'success',
            helpText: null,
            requiredNotification: false,
            currentValue: inputValue,
            dirty: this.state.committedValue !== inputValue
        });
        return true;
    };

    async handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newValue = event.currentTarget.value;
        if (typeof newValue !== 'string') {
            return;
        }
        await this.validate(newValue);
    }

    commit() {
        if (this.state.status === 'success' &&
            this.state.dirty &&
            typeof this.state.currentValue !== 'undefined') {
            this.props.updateProfileField(this.state.currentValue);
            this.setState({
                dirty: false,
                committedValue: this.state.currentValue
            });
        }
    }

    render() {
        return (
            <Form.Item
                required={this.state.requiredNotification || undefined}
                label={this.props.label}
                // hasFeedback 
                help={this.state.helpText}
                validateStatus={this.state.status || undefined}
                style={{ display: this.props.hidden ? 'none' : 'block' }}
            >
                <Input
                    allowClear={true}
                    placeholder={this.props.placeHolder}
                    maxLength={this.props.maxLength}
                    minLength={this.props.minLength}
                    onBlur={this.commit.bind(this)}
                    onPressEnter={this.commit.bind(this)}
                    onChange={this.handleOnChange.bind(this)}
                    // onInput={this.handleOnInput.bind(this)}
                    defaultValue={this.props.defaultValue}
                />
            </Form.Item>
        );
    };
};
