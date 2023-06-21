import React, {Component} from 'react'
import { Form, AutoComplete } from 'antd';
import Select, { SelectValue } from 'antd/lib/select';
import { MIN_ORGANIZATION_CHARS, MAX_INSTITUTIONS_TO_SHOW, MAX_ORGANIZATION_CHARS } from '../../constants';
import { institutions } from '../../dataSources/institutions';
import { ValidationState, ValidationStatus } from '../../types';

export interface OrganizationProps {
    // field: Field
    required: boolean;
    defaultValue: string | null;
    commit: (value: string) => void;
}

interface OrganizationState {
    validationState: ValidationState<string>;
    institutionFiltered: Array<string>;
    tooManyInstitutionsToRender: [boolean, number?];
}

export default class Organization extends Component<OrganizationProps, OrganizationState> {
    value: string | null;
    dirty: boolean;
    validationState: ValidationState<string>;
    constructor(props: OrganizationProps) {
        super(props);
        this.value = null;
        this.dirty = false;
        this.validationState = {
            status: ValidationStatus.NONE
        };
        this.state = {
            validationState: {
                status: ValidationStatus.NONE
            },
            institutionFiltered: [],
            tooManyInstitutionsToRender: [false]
        };
    }

    update(newValue: string) {
        const previousValidationState = this.validationState;
        const validationState = this.validate(newValue);
        switch (validationState.status) {
            case ValidationStatus.SUCCESS:
                switch (previousValidationState.status) {
                    case ValidationStatus.SUCCESS:
                        if (newValue !== previousValidationState.value) {
                            this.dirty = true;
                        }
                        break;
                    default:
                        this.dirty = true;
                }
        }

        this.validationState = validationState;
        this.setState({
            validationState
        });
    }

    validate(newValue: string): ValidationState<string> {
        newValue = newValue.trim();
        if (newValue.length === 0) {
            return {
                status: ValidationStatus.SUCCESS,
                value: newValue
            };
        }
        if (newValue.length <= MIN_ORGANIZATION_CHARS) {
            return {
                status: ValidationStatus.ERROR,
                message: `Organization must be at least ${MIN_ORGANIZATION_CHARS} characters long`
            };
        }
        if (newValue.length >= MAX_ORGANIZATION_CHARS) {
            return {
                status: ValidationStatus.ERROR,
                message: `Organization must no more than ${MAX_ORGANIZATION_CHARS} characters long`
            };
        }
        return {
            status: ValidationStatus.SUCCESS,
            value: newValue
        };
    }

    // TODO: allowClear will cause undefined to be sent for onChange
    onChange(newValue: SelectValue | undefined) {
        if (typeof newValue === 'undefined') {
            newValue = '';
        }
        this.update(newValue.toString());
    }

    onSelect(newValue: SelectValue) {
        if (newValue) {
            this.update(newValue.toString());
            this.onBlur();
        }
    }

    onSearch(value: string) {
        if (value.length >= MIN_ORGANIZATION_CHARS) {
            const filtered = institutions.filter((item) =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            if (filtered.length <= MAX_INSTITUTIONS_TO_SHOW) {
                this.setState({ tooManyInstitutionsToRender: [false] });
                this.setState({ institutionFiltered: filtered });
            } else {
                this.setState({ tooManyInstitutionsToRender: [true, filtered.length] });
            }
        };
    }

    commit() {
        if (this.validationState.status === ValidationStatus.SUCCESS) {
            if (this.dirty) {
                this.props.commit(this.validationState.value);
            }
        }
        this.dirty = false;
        this.setState({
            institutionFiltered: []
        });
    }

    onBlur() {
        this.commit();
    }

    onFocus() {
        this.onSearch(this.props.defaultValue || '');
    }

    async onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key !== 'Enter') {
            return;
        }
        this.commit();
    }

    getValidationMessage() {
        if (this.state.validationState.status === ValidationStatus.ERROR) {
            return this.state.validationState.message;
        }
    }

    getValidationStatus() {
        switch (this.state.validationState.status) {
            case ValidationStatus.NONE:
                return '';
            case ValidationStatus.SUCCESS:
                return 'success';
            case ValidationStatus.ERROR:
                return 'error';
            case ValidationStatus.WARNING:
                return 'warning';
            case ValidationStatus.VALIDATING:
                return 'validating';
        }
    }

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
            style={{ flexGrow: 1 }}
            required={this.props.required}
            label='Organization'
            help={this.getValidationMessage()}
            validateStatus={this.getValidationStatus()} >
            <AutoComplete
                placeholder='Organization'
                allowClear
                onSelect={this.onSelect.bind(this)}
                onChange={this.onChange.bind(this)}
                onFocus={this.onFocus.bind(this)}
                onSearch={this.onSearch.bind(this)}
                onKeyUp={this.onKeyUp.bind(this)}
                dropdownMatchSelectWidth={false}
                defaultValue={this.props.defaultValue || ''}
                onBlur={this.onBlur.bind(this)}
            >
                {children}
            </AutoComplete>
        </Form.Item >;
    }
}
