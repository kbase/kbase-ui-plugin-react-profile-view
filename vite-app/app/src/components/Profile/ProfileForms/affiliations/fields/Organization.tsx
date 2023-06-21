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
    committedValue?: string;
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
            committedValue: this.props.value || undefined,
            dirty: false,
            tooManyInstitutionsToRender: [false],
            institutionFiltered: []
        };
    }

    async componentDidMount() {
        await this.validate(this.props.value || undefined);
    }

    validate(newValue: string | undefined): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                if (newValue === undefined || newValue.length === 0) {
                    this.props.status('error');
                    this.setState({
                        status: 'error',
                        message: `The Organization is required`
                    }, () => {
                        resolve(false);
                    });
                } else if (newValue.length <= MIN_ORGANIZATION_CHARS) {
                    this.props.status('error');
                    this.setState({
                        status: 'error',
                        message: `Organization must be at least ${MIN_ORGANIZATION_CHARS} characters long`
                    }, () => {
                        resolve(false);
                    });
                } else if (newValue.length >= MAX_ORGANIZATION_CHARS) {
                    this.props.status('error');
                    this.setState({
                        status: 'error',
                        message: `Organization must be no longer than ${MAX_ORGANIZATION_CHARS} characters long`
                    }, () => {
                        resolve(false);
                    });
                } else {
                    this.props.status('success');
                    this.setState({
                        status: 'success',
                        currentValue: newValue,
                        message: '',
                        dirty: (this.state.committedValue !== newValue)
                    }, () => {
                        resolve(true);
                    });
                }
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

    async onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key !== 'Enter') {
            return;
        }
        this.commit();
    }

    async onChange(newValue: SelectValue) {
        if (typeof newValue !== 'string') {
            return;
        }
        await this.validate(newValue);
    }

    async onSelect(newValue: SelectValue) {
        if (typeof newValue !== 'string') {
            return;
        }
        await this.validate(newValue);
        this.commit();
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
        } else {
            this.setState({
                tooManyInstitutionsToRender: [false],
                institutionFiltered: []
            });
        }
    };

    render() {
        let children;
        if (this.state.tooManyInstitutionsToRender[0]) {
            children = <Select.Option
                value=""
                key="sorry">
                Keep Searching - too many ({this.state.tooManyInstitutionsToRender[1]}) to show (max {MAX_INSTITUTIONS_TO_SHOW})
                </Select.Option>;
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
            style={{ flexGrow: 1, marginBottom: 0 }}
            required={true}
            help={this.state.message}
            validateStatus={this.state.status}
        >
            <AutoComplete
                placeholder='Organization'
                onSelect={this.onSelect.bind(this)}
                onChange={this.onChange.bind(this)}
                onBlur={this.commit.bind(this)}
                onSearch={this.onSearch.bind(this)}
                dropdownMatchSelectWidth={false}
                defaultValue={this.props.value || undefined}
                onKeyUp={this.onKeyUp.bind(this)}
            >
                {children}
            </AutoComplete>
        </Form.Item>;
    }
}
