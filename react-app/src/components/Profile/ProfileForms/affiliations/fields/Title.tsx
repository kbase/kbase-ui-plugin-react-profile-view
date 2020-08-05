import React from 'react';
import { Form, Input } from 'antd';
import { MIN_TITLE_CHARS, MAX_TITLE_CHARS } from '../../../../../constants';
import { AntDesignValidationStatus } from '../../../../../types';

export interface TitleProps {
    value: string | null;
    commit: (value: string) => void;
    status: (status: AntDesignValidationStatus) => void;
}

interface TitleState {
    message: string;
    status: AntDesignValidationStatus;
    currentValue?: string;
    committedValue?: string;
    dirty: boolean;
    tooManyInstitutionsToRender: [boolean, number?];
    institutionFiltered: Array<string>;
}

export default class Title extends React.Component<TitleProps, TitleState> {
    constructor(props: TitleProps) {
        super(props);
        this.state = {
            message: '',
            status: '',
            currentValue: this.props.value || undefined,
            committedValue: this.props.value || undefined,
            dirty: false,
            tooManyInstitutionsToRender: [false],
            institutionFiltered: []
        };
    }

    async componentDidMount() {
        // hmm, try simulating control input when first
        // mounted?
        await this.validate(this.props.value || undefined);
    }

    validate(newValue: string | undefined) {
        return new Promise((resolve, reject) => {
            try {
                if (newValue === undefined || newValue.length === 0) {
                    this.props.status('error');
                    this.setState({
                        status: 'error',
                        message: `The Job Title is required`
                    }, () => {
                        resolve(false);
                    });
                    return;
                }
                if (newValue.length <= MIN_TITLE_CHARS) {
                    this.props.status('error');
                    this.setState({
                        status: 'error',
                        message: `Job Title must be at least ${MIN_TITLE_CHARS} characters long`
                    }, () => {
                        resolve(false);
                    });
                    return;
                }
                if (newValue.length >= MAX_TITLE_CHARS) {
                    this.props.status('error');
                    this.setState({
                        status: 'error',
                        message: `Job Title must be no longer than ${MAX_TITLE_CHARS} characters long`
                    }, () => {
                        resolve(false);
                    });
                    return;
                }

                this.props.status('success');
                this.setState({
                    status: 'success',
                    currentValue: newValue,
                    message: '',
                    dirty: (this.state.committedValue !== newValue)
                }, () => {
                    resolve(true);
                });
            } catch (ex) {
                reject(ex);
            }
        });
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

    async onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newValue = event.currentTarget.value;
        if (typeof newValue !== 'string') {
            return;
        }
        await this.validate(newValue);
    }

    render() {
        return <Form.Item
            style={{ flexGrow: 1, marginBottom: 0 }}
            required={true}
            help={this.state.message}
            validateStatus={this.state.status}
        >
            <Input
                style={{ width: '100%' }}
                type='text'
                maxLength={50}
                defaultValue={this.props.value || undefined}
                placeholder={'Job title'}
                onChange={this.onChange.bind(this)}
                onPressEnter={this.commit.bind(this)}
                onBlur={this.commit.bind(this)}
            />
        </Form.Item>;
    }
}
