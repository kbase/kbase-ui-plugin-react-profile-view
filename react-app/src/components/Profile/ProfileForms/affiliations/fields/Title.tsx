import React, { ChangeEvent } from 'react';
import { Form, Input } from 'antd';
import { MIN_TITLE_CHARS, MAX_TITLE_CHARS } from '../../../../../constants';
import { AntDesignValidationStatus } from '../../../../../types';
import { SelectValue } from 'antd/lib/select';


export interface TitleProps {
    value: string | null;
    commit: (value: string) => void;
    status: (status: AntDesignValidationStatus) => void;
}

interface TitleState {
    message: string;
    status: AntDesignValidationStatus;
    currentValue?: string;
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
            dirty: false,
            tooManyInstitutionsToRender: [false],
            institutionFiltered: []
        };
    }

    componentDidMount() {
        // hmm, try simulating control input when first
        // mounted?
        this.validate(this.props.value || undefined);
    }

    validate(newValue: string | undefined) {
        if (newValue === undefined || newValue.length === 0) {
            this.props.status('error');
            this.setState({
                status: 'error',
                message: `The Job Title is required`
            });
        } else if (newValue.length <= MIN_TITLE_CHARS) {
            this.props.status('error');
            this.setState({
                status: 'error',
                message: `Job Title must be at least ${MIN_TITLE_CHARS} characters long`
            });
        } else if (newValue.length >= 100) {
            this.props.status('error');
            this.setState({
                status: 'error',
                message: `Job Title must be no longer than ${MAX_TITLE_CHARS} characters long`
            });

        } else {
            this.props.status('success');
            this.setState({
                status: 'success',
                currentValue: newValue,
                message: '',
                dirty: (this.state.currentValue !== newValue)
            });
        }

    }
    onChange(e: ChangeEvent<HTMLInputElement>) {
        this.validate(e.target.value);
    }
    onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {

    }
    maybeCommit() {
        if (this.state.status === 'success' && this.state.dirty && typeof this.state.currentValue !== 'undefined') {
            this.props.commit(this.state.currentValue);
            this.setState({
                dirty: false
            });
        }
    }
    onBlur() {
        this.maybeCommit();
    }
    onSelect(newValue: SelectValue) {
        this.validate(newValue.toString());
        this.maybeCommit();
    }
    render() {
        return <Form.Item
            style={{ flexGrow: 1 }}
            required={true}
            // label=' '
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
                onBlur={this.onBlur.bind(this)}
            />
        </Form.Item>;
    }
}