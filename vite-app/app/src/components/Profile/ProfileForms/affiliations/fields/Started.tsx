import { Form, InputNumber, Tooltip } from 'antd';
import React from 'react';
import { MAX_AFFILIATION_DATE, MIN_AFFILIATION_DATE } from '../../../../../constants';
import { AntDesignValidationStatus } from '../../../../../types';

export interface StartedProps {
    value: number | null;
    ended: number | null,
    commit: (value: number) => void;
    status: (status: AntDesignValidationStatus) => void;
}

interface StartedState {
    message: string;
    status: AntDesignValidationStatus;
    currentValue?: number;
    committedValue?: number;
    dirty: boolean;
}

export default class Ended extends React.Component<StartedProps, StartedState> {
    constructor(props: StartedProps) {
        super(props);
        this.state = {
            message: '',
            status: '',
            currentValue: this.props.value || undefined,
            committedValue: this.props.value || undefined,
            dirty: false
        };
    }

    componentDidMount() {
        this.validate(this.props.value);
    }

    validate(newValue: number | null) {
        if (newValue === null) {
            this.props.status('error');
            this.setState({
                status: 'error',
                message: `The start year is required`
            });
        } else {
            const thisYear = new Date().getFullYear();
            if (newValue > thisYear) {
                this.props.status('error');
                this.setState({
                    status: 'error',
                    message: `The start year must be less than or equal to the current year (${thisYear})`
                });
            } else if (this.props.ended && newValue > this.props.ended) {
                this.props.status('error');
                this.setState({
                    status: 'error',
                    message: `The start year must be no greater than the end year (${this.props.ended})`
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
        return <Tooltip title='Enter 4 digit start year'>
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
                    placeholder='Year Started'
                    defaultValue={this.props.value || undefined}
                    onBlur={this.commit.bind(this)}
                    onPressEnter={this.commit.bind(this)}
                />
            </Form.Item>
        </Tooltip>;
    }
}
