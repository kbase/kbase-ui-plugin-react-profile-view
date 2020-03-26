import React from 'react';
import {
    Form, Input, AutoComplete, Tooltip, Select, InputNumber
} from 'antd';
import { Affiliation } from '../../../../redux/interfaces';
import { institutions } from '../../../../dataSources';
import './AffiliationForm.css';
import { SelectValue } from 'antd/lib/select';
import { ColProps } from 'antd/lib/col';
import {
    AffiliationEditState, MIN_ORGANIZATION_CHARS, MAX_INSTITUTIONS_TO_SHOW,
    MIN_AFFILIATION_DATE, MAX_AFFILIATION_DATE
} from './fields';

const { Option } = Select;


// enum ValidationStatus {
//     NONE = '',
//     ERROR = 'error',
//     SUCCESS = 'success',
//     WARNING = 'warning',
//     VALIDATING = 'validating'
// }
export interface Props {
    affiliation: Affiliation;
    save: (affiliation: Affiliation) => void;
    // canSave: (isSavable: boolean) => void;
    // deleteAffiliation: () => void;
};

interface State {
    // affiliation: AffiliationValidated;
    institutionFiltered: Array<string>;
    editor: AffiliationEditState;
    tooManyInstitutionsToRender?: [boolean, number?];
};


const formItemLayout: {
    labelCol: ColProps,
    wrapperCol: ColProps;
} = {
    labelCol: {
        // flex: '0 0 1em'
        xs: { span: 24 },
        sm: { span: 1 }
    },
    wrapperCol: {
        // flex: '1 1 0px'
        xs: { span: 24 },
        sm: { span: 23 }
    },
};

export default class AffiliationForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            institutionFiltered: [],
            editor: new AffiliationEditState(this.props.affiliation, this.onValidated.bind(this), this.onCommit.bind(this))
        };
    };

    onValidated(affiliation: Affiliation) {
        // this.props.save(affiliation);
        console.log('on validate', affiliation);
    }

    onCommit(affiliation: Affiliation) {
        this.props.save(affiliation);
    }

    // deleteAffiliation() {
    //     this.props.deleteAffiliation();
    // };

    /**
     * Save/update local state and call input validation function
     * @param event 
     * @param index 
     */
    titleOnChange(event: any) {
        const newValue = event.target.value;
        const title = this.state.editor.title;
        title.update(newValue);
        this.setState({ editor: this.state.editor });

        // If validation error, just update the state and do nothing.
        // if (!this.state.editor.title.isError()) {
        //     this.props.save(this.state.editor.getValue());
        // }

        // Otherwise, update the state, and then save.
        // TODO: we should have a dirty/clean flag in order to provide feedback
        // that the changed field has been saved.
        // OR: a notification that a save has happened.
    };



    /**
     * Save/update local state and call input validation function
     * check if it's smaller than the corresponding end year
     * @param event 
     * @param index 
     */
    startedOnChange(newValue: number | undefined) {
        // Hmm, not sure how to handle this --- CAN a number input provide undefined
        // if it shouldn't?
        if (newValue === undefined) {
            return;
        }
        this.state.editor.started.update(newValue);
        this.setState({ editor: this.state.editor });

        // If validation error, just update the state and do nothing.
        // if (!this.state.editor.started.isError()) {
        //     this.props.save(this.state.editor.getValue());
        // }
    };

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
        if (['Backspace', 'Delete', 'Enter'].includes(e.key)) {
            return;
        }

        // Otherwise, ignore all other keys.
        e.preventDefault();
    }

    startedOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        this.numberEditingOnly(e);
    }

    /**
     * Save/update local state and call input validation function
     * check if it's later than the corresponding start year. 
     * @param newValue - the newly set affiliation end date 
     * @param index - the index of the affiliation within the affiliations collection
     */
    endedOnChange(newValue: number | undefined) {
        this.state.editor.ended.update(newValue);
        this.setState({ editor: this.state.editor });

        // If validation error, just update the state and do nothing.
        // TODO: why is this just checking the title? should be every field.
        // console.log('saving', this.state.editor.getValue());
        // if (!this.state.editor.ended.isError()) {
        //     this.props.save(this.state.editor.getValue());
        // }
        // const affiliations = this.state.affiliations;
        // const affiliation = affiliations[index];

        // // if the entry is empty, then set the state to undefined.
        // if (!newValue) {
        //     affiliation.validatedStatusEndYear = undefined;
        //     affiliation.ended = undefined;
        //     affiliation.helpTextEndYear = undefined;
        // } else {
        //     if (affiliation.started) {
        //         if (newValue < affiliation.started) {
        //             affiliation.validatedStatusEndYear = 'error';
        //             affiliation.helpTextEndYear = 'must be greater than or equal to the start year, or empty';
        //         } else if (newValue >= affiliation.started) {
        //             affiliation.validatedStatusEndYear = undefined;
        //             affiliation.helpTextEndYear = undefined;
        //             affiliation.helpTextStartYear = undefined;
        //             affiliation.validatedStatusStartYear = undefined;
        //         }
        //     }
        // }
        // this.setState({ affiliations });
    };

    endedOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        this.numberEditingOnly(e);
    }

    // Organization control

    onSelectOrganization(newValue: SelectValue) {
        this.state.editor.organization.update(newValue.toString());
        this.setState({ editor: this.state.editor });
        this.state.editor.organization.commit();

        // If validation error, just update the state and do nothing.
        // if (!this.state.editor.organization.isError()) {
        //     this.props.save(this.state.editor.getValue());
        // }
    }

    onChangeOrganization(newValue: SelectValue) {
        this.state.editor.organization.update(newValue.toString());
        this.setState({ editor: this.state.editor });

        if (newValue.toString().length === 0) {
            this.setState({ institutionFiltered: [] });
        }

        // If validation error, just update the state and do nothing.
        // if (!this.state.editor.organization.isError()) {
        //     this.props.save(this.state.editor.getValue());
        // }
    };

    /**
    * Save/update local state and call input validation function
    * filters list of insitution before update state.
    * @param value 
    * @param index 
    */
    // institutionOnSearch(value: string) {
    //     const institutionFiltered = institutions.filter((item) => {
    //         return item.toLowerCase().includes(value.toLowerCase());
    //     });
    //     if (institutionFiltered.length <= 1000) {
    //         this.setState({ institutionFiltered });
    //     };
    // };

    onSearchOrganization(value: string) {
        if (value.length >= MIN_ORGANIZATION_CHARS) {
            const filtered = institutions.filter((item) =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            if (filtered.length <= MAX_INSTITUTIONS_TO_SHOW) {
                this.setState({ tooManyInstitutionsToRender: undefined });
                this.setState({ institutionFiltered: filtered });
            } else {
                this.setState({ tooManyInstitutionsToRender: [true, filtered.length] });
            }
        };
    };

    renderOrganizations(affiliation: Affiliation) {
        let children;
        if (this.state.tooManyInstitutionsToRender) {
            children = <Option key="sorry">Keep Searching - too many ({this.state.tooManyInstitutionsToRender[1]}) to show (max {MAX_INSTITUTIONS_TO_SHOW})</Option>;
        } else {
            children = this.state.institutionFiltered.map((item, index) => {
                return (
                    <Option key={index} value={item} >
                        {item}
                    </Option>
                );
            });
        }
        return <Form.Item {...formItemLayout}
            style={{ flexGrow: 1 }}
            required={true}
            label=' '
            help={this.state.editor.organization.message}
            validateStatus={this.state.editor.organization.status}                      >
            <AutoComplete
                placeholder='Organization'
                onSelect={this.onSelectOrganization.bind(this)}
                onChange={this.onChangeOrganization.bind(this)}
                onSearch={this.onSearchOrganization.bind(this)}
                dropdownMatchSelectWidth={false}
                defaultValue={affiliation.organization}
                onBlur={() => { this.state.editor.organization.commit(); }}
            >
                {children}
            </AutoComplete>
        </Form.Item>;
    }

    /**
     * builds affiliation card
     */
    render() {
        const { affiliation } = this.props;
        // const { getFieldDecorator } = this.props.form;
        // let endDateMin: number;
        // if (affiliation.started) {
        //     endDateMin = affiliation.started;
        // } else {
        //     endDateMin = MIN_AFFILIATION_DATE;
        // }

        return (
            <form
                className='affiliation-row ant-form '
                // name={index.toString(10)}
                autoComplete="on">
                <div className='AffiliationsRow'>
                    <div className='AffiliationsCol'>
                        <Form.Item {...formItemLayout}
                            required={true}
                            label=' '
                            // hasFeedback
                            help={this.state.editor.title.message}
                            validateStatus={this.state.editor.title.status} >
                            <Input
                                style={{ width: '100%' }}
                                // autoComplete='organization-title'
                                type='text'
                                maxLength={50}
                                defaultValue={affiliation.title}
                                placeholder={'Job title'}
                                onChange={this.titleOnChange.bind(this)}
                                onBlur={() => { this.state.editor.title.commit(); }}
                            />
                        </Form.Item>
                    </div>
                    <div className='AffiliationsCol'>
                        {this.renderOrganizations(affiliation)}
                    </div>
                    <div className='AffiliationsCol'>
                        <Tooltip title='Enter 4 digit start year year'>
                            <Form.Item {...formItemLayout}
                                required={true}
                                label=' '
                                // hasFeedback
                                style={{ overflowX: 'auto' }}
                                help={this.state.editor.started.message}
                                validateStatus={this.state.editor.started.status} >
                                <InputNumber
                                    onChange={this.startedOnChange.bind(this)}
                                    maxLength={4}
                                    width='100%'
                                    type="number"
                                    min={MIN_AFFILIATION_DATE}
                                    max={MAX_AFFILIATION_DATE}
                                    placeholder='Start'
                                    onKeyDown={this.startedOnKeyDown.bind(this)}
                                    defaultValue={affiliation.started}
                                    onBlur={() => { this.state.editor.started.commit(); }}
                                />
                            </Form.Item>
                        </Tooltip>
                    </div>
                    <div className='AffiliationsCol'>
                        <Tooltip title='Enter 4 digit end year or leave empty if ongoing'>
                            <Form.Item {...formItemLayout}
                                required={false}
                                label=' '
                                // hasFeedback
                                style={{ overflowX: 'auto' }}
                                help={this.state.editor.ended.message}
                                validateStatus={this.state.editor.ended.status} >
                                <InputNumber
                                    onChange={this.endedOnChange.bind(this)}
                                    onKeyDown={this.endedOnKeyDown.bind(this)}
                                    maxLength={4}
                                    width='100%'
                                    type="number"
                                    // TODO: why doesn't this work
                                    // min={endDateMin}
                                    min={MIN_AFFILIATION_DATE}
                                    max={MAX_AFFILIATION_DATE}
                                    placeholder='End'
                                    defaultValue={affiliation.ended || undefined}

                                    onBlur={() => { this.state.editor.ended.commit(); }}
                                />
                            </Form.Item>
                        </Tooltip>
                    </div>


                </div>
            </form>
        );
    }
}
