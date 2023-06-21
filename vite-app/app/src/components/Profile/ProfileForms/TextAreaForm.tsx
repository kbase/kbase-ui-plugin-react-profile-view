import React from 'react';
import { Form, Input } from 'antd';
import { DEFAULT_MIN_TEXT_LENGTH, DEFAULT_MAX_TEXT_LENGTH } from '../../../constants';

const { TextArea } = Input;


interface Props {
    hidden: boolean;
    required?: boolean;
    updateProfileField: (value: string) => void;
    placeHolder?: string;
    defaultValue?: string | undefined;
    readOnly: boolean;
    maxLength?: number;
    minLength?: number;
};

interface State {
    currentValue: string;
    committedValue: string;
    status?: "" | "error" | "success" | "warning" | "validating" | null;
    helpText: string | null;
    dirty: boolean;
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
            currentValue: props.defaultValue || '',
            committedValue: props.defaultValue || '',
            status: null,
            helpText: null,
            dirty: false
        };
    }

    componentDidMount() {
        this.validate(this.state.currentValue);
    };

    /**
     * Validate value against 
     *  - max and min length
     *  - if it's required field
     *  - input type 
     * and set state per validation result.
     * @param inputValue 
     */
    validate(inputValue: string) {
        const minLength = typeof this.props.minLength === 'undefined' ? DEFAULT_MIN_TEXT_LENGTH : this.props.minLength;
        const maxLength = typeof this.props.maxLength === 'undefined' ? DEFAULT_MAX_TEXT_LENGTH : this.props.maxLength;

        if (this.props.required && inputValue.length === 0) {
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
            currentValue: inputValue,
            dirty: this.state.committedValue !== inputValue
        });
        return true;
    };

    /**
     * Save/update input value to state
     * @param event 
     */
    async handleOnChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
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
                help={this.state.helpText}
                validateStatus={this.state.status || undefined}>
                <TextArea
                    autoSize
                    hidden={this.props.hidden}
                    placeholder={this.props.placeHolder}
                    readOnly={this.props.readOnly}
                    maxLength={this.props.maxLength}
                    minLength={this.props.minLength}
                    onBlur={this.commit.bind(this)}
                    onPressEnter={this.commit.bind(this)}
                    onChange={this.handleOnChange.bind(this)}
                    defaultValue={this.props.defaultValue}
                />
            </Form.Item>
        );
    }
};

export default TextAreaForm;
