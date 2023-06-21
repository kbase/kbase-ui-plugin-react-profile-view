import { Form, InputNumber, Tooltip } from 'antd';
import React from 'react';
import { MAX_AFFILIATION_DATE, MIN_AFFILIATION_DATE } from '../../../../../constants';
import { AntDesignValidationStatus } from '../../../../../types';

export interface EndedProps {
    value: number | null;
    started: number,
    commit: (value: number | null) => void;
    status: (status: AntDesignValidationStatus) => void;
}

interface EndedState {
    message: string;
    status: AntDesignValidationStatus;
    currentValue: number | null;
    committedValue: number | null;
    dirty: boolean;
}

export default class Ended extends React.Component<EndedProps, EndedState> {
    constructor(props: EndedProps) {
        super(props);
        this.state = {
            message: '',
            status: '',
            currentValue: this.props.value,
            committedValue: this.props.value,
            dirty: false
        };
    }

    componentDidMount() {
        this.validate(this.props.value);
    }

    validate(newValue: number | null) {
        if (newValue === null) {
            this.props.status('success');
            this.setState({
                status: 'success',
                currentValue: null,
                message: '',
                dirty: (this.state.committedValue !== newValue)
            });
        } else {
            const thisYear = new Date().getFullYear();

            if (newValue > thisYear) {
                this.props.status('error');
                this.setState({
                    status: 'error',
                    message: `The end year ${newValue} must be less than or equal to the current year (${thisYear})`
                });
            } else if (newValue < this.props.started) {
                this.props.status('error');
                this.setState({
                    status: 'error',
                    message: `The end year ${newValue} must be greater than the start year (${this.props.started})`
                });
            } else {
                this.props.status('success');
                this.setState({
                    status: 'success',
                    currentValue: newValue,
                    message: '',
                    dirty: (this.state.committedValue !== newValue)
                });
            }
        }
    }
    onChange(value: number | null) {
        this.validate(value);
    }
    numberEditingOnly(e: React.KeyboardEvent<HTMLInputElement>) {
        // Allow typing of number digits
        if (e.key >= '0' && e.key <= '9') {
            // Don't allow anything if the control is already full.
            const maxLengthAttribute = e.currentTarget.getAttribute('maxlength');
            if (maxLengthAttribute !== null) {
                const maxLength = parseInt(maxLengthAttribute);
                const currentLength = e.currentTarget.value.length;
                if (currentLength >= maxLength) {
                    e.preventDefault();
                    return;
                }
            }
            return;
        }

        // Allow editing keys
        if (['Backspace', 'Delete', 'Enter', 'Tab'].includes(e.key)) {
            return;
        }

        // Otherwise, ignore all other keys.
        e.preventDefault();
    }
    onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        this.numberEditingOnly(event);
    }
    commit() {
        if (this.state.status === 'success' &&
            this.state.dirty &&
            typeof this.state.currentValue !== 'undefined') {
            this.props.commit(this.state.currentValue);
            this.setState({
                dirty: false,
                committedValue: this.state.currentValue
            });
        }
    }

    render() {
        return <Tooltip title='Enter 4 digit end year or leave empty if ongoing'>
            <Form.Item
                required={false}
                style={{ overflowX: 'auto', marginBottom: 0 }}
                help={this.state.message}
                validateStatus={this.state.status} >
                <InputNumber
                    onChange={this.onChange.bind(this)}
                    onKeyDown={this.onKeyDown.bind(this)}
                    maxLength={4}
                    width='100%'
                    min={MIN_AFFILIATION_DATE}
                    max={MAX_AFFILIATION_DATE}
                    placeholder='Year Ended'
                    defaultValue={this.props.value || undefined}
                    onBlur={this.commit.bind(this)}
                    onPressEnter={this.commit.bind(this)}
                />
            </Form.Item>
        </Tooltip>;
    }
}
