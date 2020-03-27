import React from 'react';
import { Form, AutoComplete, Select } from 'antd';
import { MIN_ORGANIZATION_CHARS, MAX_ORGANIZATION_CHARS, MAX_INSTITUTIONS_TO_SHOW } from '../../../../../constants';
import { AntDesignValidationStatus } from '../../../../../types';
import { institutions } from '../../../../../dataSources';
import { SelectValue } from 'antd/lib/select';

export interface OrganizationProps {
    value: string | null;
    commit: (value: string) => void;
    status: (status: AntDesignValidationStatus) => void;
}

interface OrganizationState {
    message: string;
    status: AntDesignValidationStatus;
    currentValue?: string;
    dirty: boolean;
    tooManyInstitutionsToRender: [boolean, number?];
    institutionFiltered: Array<string>;
}

export default class Organization extends React.Component<OrganizationProps, OrganizationState> {
    constructor(props: OrganizationProps) {
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
                message: `The Organization is required`
            });
        } else if (newValue.length <= MIN_ORGANIZATION_CHARS) {
            this.props.status('error');
            this.setState({
                status: 'error',
                message: `Organization must be at least ${MIN_ORGANIZATION_CHARS} characters long`
            });
        } else if (newValue.length >= 100) {
            this.props.status('error');
            this.setState({
                status: 'error',
                message: `Organization must be no longer than ${MAX_ORGANIZATION_CHARS} characters long`
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
    onChange(newValue: SelectValue) {
        this.validate(newValue.toString());

        if (newValue.toString().length === 0) {
            this.setState({ institutionFiltered: [] });
        }
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
    onSearch(value: string) {
        if (value.length >= MIN_ORGANIZATION_CHARS) {
            const filtered = institutions.filter((item) =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            if (filtered.length <= MAX_INSTITUTIONS_TO_SHOW) {
                this.setState({
                    tooManyInstitutionsToRender: [false],
                    institutionFiltered: filtered
                });
            } else {
                this.setState({
                    tooManyInstitutionsToRender: [true, filtered.length]
                });
            }
        };
    };
    onSelect(newValue: SelectValue) {
        this.validate(newValue.toString());
        this.maybeCommit();
    }
    render() {
        let children;
        if (this.state.tooManyInstitutionsToRender[0]) {
            children = <Select.Option key="sorry">Keep Searching - too many ({this.state.tooManyInstitutionsToRender[1]}) to show (max {MAX_INSTITUTIONS_TO_SHOW})</Select.Option>;
        } else {
            children = this.state.institutionFiltered.map((item, index) => {
                return (
                    <Select.Option key={index} value={item} >
                        {item}
                    </Select.Option>
                );
            });
        }
        return <Form.Item
            style={{ flexGrow: 1 }}
            required={true}
            // label=' '
            help={this.state.message}
            validateStatus={this.state.status}
        >
            <AutoComplete
                placeholder='Organization'
                onSelect={this.onSelect.bind(this)}
                onChange={this.onChange.bind(this)}
                onSearch={this.onSearch.bind(this)}
                dropdownMatchSelectWidth={false}
                defaultValue={this.props.value || undefined}
                onBlur={this.onBlur.bind(this)}
            >
                {children}
            </AutoComplete>
        </Form.Item>;

    }
}