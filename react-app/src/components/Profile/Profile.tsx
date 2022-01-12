import React, { CSSProperties } from 'react';
import {
    Row, Col, Input, Tooltip, Form, Checkbox,
    Modal, Select, Button, Empty, message
} from 'antd';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import {marked} from 'marked';

import { UserName, ProfileUserdata, Affiliation } from '../../redux/interfaces';
import nouserpic from '../../assets/nouserpic.png';
import OrgsContainer from '../Orgs/OrgsContainer';
import InputWrapper from './ProfileForms/InputForm';
import TextAreaForm from './ProfileForms/TextAreaForm';
import AffiliationsForm from './ProfileForms/affiliations/AffiliationsForm';
import OrganizationField from '../Organization';

// import { researchInterestsList, jobTitles, ListItem } from '../../profileConfig';
import researchInterestsList from '../../dataSources/researchInterestsOptions';
import jobTitles from '../../dataSources/jobTitlesOptions';
import {
    fundingSources, countryCodes, institutions, states, avatarOptions, gravatarDefaults
} from '../../dataSources';
import { SelectValue } from 'antd/lib/select';

import './Profile.css';
import Area from '../Area';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

const { Option } = Select;

enum ModalName {
    ResearchInterests,
    AvatarOption,
};



interface Props {
    userName: UserName;
    editEnable: boolean; //true when auth user and userID is equal
    profileUserdata: ProfileUserdata;
    gravatarHash: string;
    profileFetchStatus: string;
    updateProfile: (userdata: ProfileUserdata, username: UserName) => void;
};

interface State {
    visibleModal: ModalName | null;
    profile: ProfileUserdata;
    institutionFiltered: Array<string>;
    tooManyInstitutionsToRender: boolean;
    isEditing: boolean;
};

/**
 * Returns profile component.
 * @param props
 */
class Profile extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            visibleModal: null,
            profile: this.props.profileUserdata,
            tooManyInstitutionsToRender: false,
            institutionFiltered: [],
            isEditing: false
        };
    };

    saveProfile() {
        this.props.updateProfile(this.state.profile, this.props.userName);
        message.success('Saved changes to your Profile');
    }

    // if you're going ot use prevProps, prevState
    // you need to put all these three for typescript to be happy.
    componentDidUpdate(prevProps: Props, prevState: State, snapshot: any) {
        if (prevState === this.state) {
            return;
        };
    };


    //if profile is auth user's profile, then make tool tips visible
    tooltipVisibility(): CSSProperties {
        if (this.state.isEditing === false) {
            return { visibility: 'hidden' };
        } else {
            return { visibility: 'visible' };
        };
    };


    // set visitbility after initial mounting
    USStateVisibility() {
        if (this.state.profile.country === 'United States') {
            return { display: 'inherit' };
        } else {
            return { display: 'none' };
        };
    };

    // Set gravatarURL
    gravatarSrc() {
        if (this.props.profileUserdata['avatarOption'] === 'silhoutte' || !this.props.gravatarHash) {
            // let gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={nouserpic} />;
            return nouserpic;
        } else if (this.props.gravatarHash) {
            return 'https://www.gravatar.com/avatar/' + this.props.gravatarHash + '?s=300&amp;r=pg&d=' + this.props.profileUserdata.gravatarDefault;
            // let gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={gravatarSrc} />;
        };
    };

    /**
     * set name field to either input field or 
     * plain text depending on if auth-user is viewing or not
     */
    setName() {
        return (<div className='name ant-card-meta-title'>{this.props.userName.name}</div>);
    };

    // Create tootip for Organization Auto Complete
    institutionToolTip() {
        return (
            <div>
                <p>Your primary association - organization, institution, business.<br />
                    You may enter your own value or chose from the option fileted by your entry.<br />
                    National Labs derived from: <a href='https://science.energy.gov/laboratories/' target='_blank' rel="noopener noreferrer">DOE Web Site - Laboratories</a><br />
                    US higher education institutions derived from: <a href='http://carnegieclassifications.iu.edu/index.php' target='_blank' rel="noopener noreferrer">Carnegie Classification of Institutions of Higher Education </a>
                </p>
            </div>
        );
    };

    renderUserNutshellEditor() {
        return (
            <Form layout="vertical">

                <Form.Item
                    label="Position">
                    <Select
                        placeholder='Job title'
                        allowClear
                        disabled={!this.props.editEnable}
                        style={{ width: '100%', marginTop: '10px' }}
                        defaultValue={this.props.profileUserdata.jobTitle}
                        onChange={this.jobTitleOnChange.bind(this)}
                    >
                        {jobTitles.map((item) => {
                            return <Option key={item.label} value={item.value}>{item.label}</Option>;
                        })}
                    </Select>
                </Form.Item>

                <InputWrapper
                    hidden={this.state.profile.jobTitle === 'Other' ? false : true}
                    type="string"
                    required={this.state.profile.jobTitle === 'Other'}
                    placeHolder='Job Title'
                    label='Position (Other)'
                    defaultValue={this.state.profile.jobTitleOther}
                    value={this.state.profile.jobTitleOther}
                    maxLength={50}
                    updateProfileField={(value: string) => {
                        this.setState({
                            profile: {
                                ...this.state.profile,
                                jobTitleOther: value
                            }
                        }, this.saveProfile.bind(this));
                    }}
                />

                <Tooltip title='must be more than 2 and less than 50 characters'>
                    <InputWrapper
                        hidden={false}
                        type="string"
                        updateProfileField={(value: string) => {
                            this.setState({
                                profile: {
                                    ...this.state.profile,
                                    department: value
                                }
                            }, this.saveProfile.bind(this));
                        }}
                        label='Department'
                        placeHolder='Department'
                        defaultValue={this.state.profile.department}
                        value={this.state.profile.department}
                        maxLength={50}
                    />
                </Tooltip>

                <OrganizationField
                    required={false}
                    defaultValue={this.state.profile.organization}
                    commit={this.organizationOnCommit.bind(this)} />

                <div style={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.3)' }}>location</div>

                {/* Country */}
                <Form.Item
                    label='Country' >
                    <Select
                        showSearch
                        allowClear
                        style={{ width: '100%' }}
                        disabled={!this.state.isEditing}
                        placeholder='Country'
                        onChange={this.onChangeCountry.bind(this)}
                        onSelect={this.countryOnSelect.bind(this)}
                        filterOption={(inputValue, option) => {
                            if (option && option.props && typeof option.props.children === 'string') {
                                const item = option.props.children;
                                return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                            } else {
                                return false;
                            }
                        }}

                        defaultValue={this.state.profile.country}
                    >
                        {Array.from(countryCodes).map((item => {
                            return (
                                <Option key={item[1]} value={item[0]}>
                                    {item[0]}
                                </Option>
                            );
                        }))}
                    </Select>
                </Form.Item>

                {/* State - only displayed if US is chosen for country */}
                <Form.Item
                    style={this.USStateVisibility()}
                    label='State'>
                    <Select
                        dropdownMatchSelectWidth
                        allowClear
                        disabled={!this.state.isEditing}
                        placeholder='State'
                        showArrow
                        onChange={this.stateOnSelect.bind(this)}
                        optionFilterProp='children'
                        filterOption={(inputValue, option) => {
                            if (option && option.props && typeof option.props.children === 'string') {
                                let item = option.props.children;
                                return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                            } else {
                                return false;
                            }
                        }}
                        defaultValue={this.state.profile.state} >
                        {states.map((item, index) => {
                            return <Option key={index} value={item}>{item}</Option>;
                        })}
                    </Select>
                </Form.Item>

                {/* City */}
                <InputWrapper
                    hidden={false}
                    type='string'
                    placeHolder='City'
                    label="City"
                    defaultValue={this.state.profile.city}
                    maxLength={85}
                    minLength={0}
                    value={this.state.profile.city}
                    updateProfileField={(value: string) => {
                        this.setState({
                            profile: {
                                ...this.state.profile,
                                city: value
                            }
                        }, this.saveProfile.bind(this));
                    }}
                />

                {/* Postal Code */}
                <InputWrapper
                    hidden={false}
                    type="string"
                    placeHolder='Postal Code'
                    label="Postal Code"
                    defaultValue={this.state.profile.postalCode}
                    value={this.state.profile.postalCode}
                    maxLength={this.state.profile.country === 'United States' ? 10 : 16}
                    minLength={this.state.profile.country === 'United States' ? 5 : 0}
                    updateProfileField={(value: string) => {
                        this.setState({
                            profile: {
                                ...this.state.profile,
                                postalCode: value
                            }
                        }, this.saveProfile.bind(this));
                    }}
                />

                {/* Primary Funding Source */}
                <Form.Item label="Primary Funding Source">
                    <Select
                        className='margin-top-10px'
                        allowClear
                        style={{ width: '100%', marginTop: '10px' }}
                        showSearch
                        disabled={!this.state.isEditing}
                        placeholder='enter 3 or more characters'
                        showArrow={true}
                        onChange={this.fundingSourceOnChange.bind(this)}
                        optionFilterProp='children'
                        filterOption={(inputValue, option) => {
                            if (option && option.props && typeof option.props.children === 'string') {
                                let str = option.props.children;
                                return str.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                            } else {
                                return false;
                            }

                        }}
                        defaultValue={this.state.profile.fundingSource}
                    >
                        {fundingSources.map((item) => {
                            return (
                                <Option key={item['value']} value={item['value']}>
                                    {item['value']}
                                </Option>
                            );
                        })}
                    </Select>
                </Form.Item>
            </Form>
        );
    }

    renderUserNutshellViewEmpty() {
        return (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No User Profile" />
        );
    }

    renderSectionTitle(title: string) {
        return <div
            style={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.3)', marginTop: '10px' }}>
            {title}
        </div>;
    }

    renderJobTitle() {
        if (this.state.profile.jobTitle) {
            return <div>
                {this.renderSectionTitle('position')}
                <div>
                    {this.state.profile.jobTitle === 'Other' ? this.state.profile.jobTitleOther : this.state.profile.jobTitle}
                </div>
            </div>;
        }
    }

    renderLocationSection() {
        const profile = this.state.profile;
        const location = (() => {
            if (profile.country === 'United States') {
                return [profile.country, profile.state, profile.city].filter(x => x).join(', ');
            } else {
                return [profile.country, profile.city].filter(x => x).join(', ');
            }
        })();

        if (!location) {
            return;
        }

        return <div>
            {this.renderSectionTitle('location')}
            <div>{location}</div>
        </div>;
    }

    renderDepartmentSection() {
        if (!this.state.profile.department) {
            return;
        }
        return <div>
            {this.renderSectionTitle('department')}
            <div>{this.state.profile.department}</div>
        </div>;
    }

    renderOrganizationSection() {
        if (!this.state.profile.organization) {
            return;
        }
        return <div>
            {this.renderSectionTitle('organization')}
            <div>{this.state.profile.organization}</div>
        </div>;
    }

    renderFundingSourceSection() {
        if (!this.state.profile.fundingSource) {
            return;
        }
        return <div>{this.renderSectionTitle('primary funding source')}
            <p>{this.state.profile.fundingSource}</p>
        </div>;
    }

    isNutshellEmpty() {
        const profile = this.state.profile;
        if (profile.jobTitle || profile.department || profile.organization || profile.fundingSource) {
            return false;
        }
        if (profile.country === 'United States') {
            if (profile.country || profile.state || profile.city) {
                return false;
            }
        } else {
            if (profile.country || profile.city) {
                return false;
            }
        }
        return true;
    }

    renderUserNutshellView() {
        if (this.isNutshellEmpty()) {
            return this.renderUserNutshellViewEmpty();
        }

        return <div>
            {this.renderJobTitle()}
            {this.renderDepartmentSection()}
            {this.renderOrganizationSection()}
            {this.renderLocationSection()}
            {this.renderFundingSourceSection()}
        </div>;
    }

    /**
     * builds User Nutshell card
     *  - Choose between the non-auth user profile  
     *    vs. editable user profile 
     *  - Return either form or plain text
     */
    renderUserNutshell() {
        if (this.state.isEditing) {
            return this.renderUserNutshellEditor();
        } else {
            return this.renderUserNutshellView();
        };
    }


    /**
     * builds research statement card
     *  - Choose between the non-auth user profile  
     *    vs. editable user profile 
     *  - Return either form or plain text
     */
    renderResearchStatement() {
        let statement;
        if (!this.state.profile.researchStatement || this.state.profile.researchStatement === '') {
            statement = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Research Statement" />;
        } else {
            // const fixed = this.props.profileUserdata.researchStatement.replace(/\n/, '<br />');
            // statement = <p style={{ whiteSpace: 'pre' }}>{this.props.profileUserdata.researchStatement}</p>;
            marked.use({
                breaks: true
            });
            const content = marked.parse(this.state.profile.researchStatement);
            statement = <div dangerouslySetInnerHTML={{ __html: content }} />;
        }

        if (this.state.isEditing) {
            return (
                <Area
                    title='Research or Personal Statement'
                    style={{ marginTop: '20px' }}
                >
                    <Tooltip title='A little bit about yourself and your research'>
                        <TextAreaForm
                            hidden={false}
                            // required={false}
                            // updateStoreState={this.saveProfile.bind(this)}
                            placeHolder=''
                            defaultValue={this.state.profile.researchStatement}
                            readOnly={!this.state.isEditing}
                            maxLength={1000}
                            updateProfileField={(value: string) => {
                                this.setState({
                                    profile: {
                                        ...this.state.profile,
                                        researchStatement: value
                                    }
                                }, this.saveProfile.bind(this));
                            }}
                        />
                    </Tooltip>
                </Area>
            );
        } else {
            return (
                <Area
                    title='Research or Personal Statement'
                    style={{ marginTop: '20px' }}
                >
                    {statement}
                </Area>
            );
        };
    };

    /**
     * builds affliations card
     *  - Choose between the non-auth user profile  
     *    vs. editable user profile 
     *  - Return either form or plain text
     */

    renderAffiliationsEditor() {
        return (
            <Area title='Affiliations' style={{ marginTop: '20px' }}>
                <AffiliationsForm
                    profileUserdata={this.state.profile}
                    editEnable={this.state.isEditing}
                    affiliations={this.state.profile.affiliations}
                    save={(affiliations: Array<Affiliation>) => {
                        this.setState({
                            profile: {
                                ...this.state.profile,
                                affiliations
                            }
                        }, () => {
                            this.saveProfile();
                        });
                    }}
                /></Area>
        );
    }

    renderAffiliationsView() {
        let affiliations = this.state.profile.affiliations;
        // non-empty array
        if (affiliations.length > 0 && affiliations[0]['title'] !== '') {
            return (
                <Area title='Affiliations' style={{ marginTop: '20px' }}>
                    <table className="LayoutTable">
                        <thead>
                            <tr>
                                <th style={{ width: "40%" }}>position</th>
                                <th style={{ width: "40%" }}>organization</th>
                                <th style={{ width: "40%" }}>tenure</th>
                            </tr>
                        </thead>
                        <tbody>
                            {affiliations
                                .filter(position => position.title)
                                .map((position, index) => {
                                    return <tr key={index}>
                                        <td>{position.title}</td>
                                        <td>{position.organization}</td>
                                        <td>{position.started} - {position.ended ? position.ended : 'present'}</td>
                                    </tr>;
                                })}
                        </tbody>
                    </table>
                </Area>
            );
        } else {
            return (
                <Area title='Affiliations' style={{ marginTop: '20px' }}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Affiliations" />
                </Area>
            );
        };
    }

    renderAffiliations() {
        if (this.state.isEditing) {
            return this.renderAffiliationsEditor();
        } else {
            return this.renderAffiliationsView();
        };
    };

    /**
     *   event Handlers
     *
     * 
     */

    /**
    * Modal popup control
    * @param event 
    * @param modal 
    */
    showModal(modal: ModalName) {
        if (this.state.isEditing === true) {
            this.setState({ visibleModal: modal });
        };
    }

    hideModal() {
        if (this.state.isEditing === true) {
            this.setState({ visibleModal: null });
        };
    };

    onChangeCountry(selectValue: SelectValue) {
        // When set to empty, the selectValue is undefined.
        // We use this to zap the country value, but since this is called
        // for every keystroke, we can't save the new value here.

        if (!selectValue) {
            this.countryChanged('');
        }
    }

    // TODO: fix avatar/gravatar default and option...

    onSelectAvatarOption(value: string) {
        // validation?
        this.setState({
            profile: {
                ...this.state.profile,
                avatarOption: value
            }
        });
    }

    onSelectGravatarDefault(value: string) {
        this.setState({
            profile: {
                ...this.state.profile,
                gravatarDefault: value
            }
        });
    }

    /**
     *  Updates store state with local avatarOption state 
     *  and gravatarDefault state
     * @param event 
     */
    avatarOptionOnSubmit() {
        // any is used here for creating generic property 
        // let profileData = this.props.profileUserdata;
        // if (profileData.gravatarDefault !== this.state.profile.gravatarDefault ||
        //     profileData.avatarOption !== this.state.profile.avatarOption) {
        //     if (typeof this.state.profile.gravatarDefault !== 'undefined') {
        //         profileData.gravatarDefault = this.state.profile.gravatarDefault;
        //     }
        //     if (typeof this.state.profile.avatarOption !== 'undefined') {
        //         profileData.avatarOption = this.state.profile.avatarOption;
        //     }
        //     this.saveProfile(profileData);
        // };
        this.saveProfile();
        this.hideModal();
    };

    countryOnSelect(value: SelectValue) {
        this.countryChanged(value!.toString());
    };

    countryChanged(country: string) {
        if (country !== 'United States' && this.state.profile.country === 'United States') {
            // reset state too.
            this.setState({
                profile: {
                    ...this.state.profile,
                    country,
                    state: ''
                }
            }, this.saveProfile.bind(this));
        } else {
            this.setState({
                profile: {
                    ...this.state.profile,
                    country
                }
            }, this.saveProfile.bind(this));
        }
    }

    stateOnSelect(state: string) {
        // TODO: bad again, modyfing props. should just copy to an instance property.
        this.setState({
            profile: {
                ...this.state.profile,
                state
            }
        }, this.saveProfile.bind(this));
    };

    /**
     * 
     * research interests
     */
    researchInterestsOtherOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        this.setState({
            profile: {
                ...this.state.profile,
                researchInterestsOther: value.trim()
            }
        }, this.saveProfile.bind(this));
    }

    // handles researchInterest check box onChange 
    researchInterestOnChange(researchInterestsValue: Array<CheckboxValueType>) {
        // console.log('research interests on change', researchInterestsChecked);
        // const researchInterests = researchInterestsChecked.map((index) => {
        //     return researchInterestsList[index];
        // });
        // if (researchInterests.findIndex((value) => {
        //     if (typeof value !== 'string') {
        //         return;
        //     }
        // }))
        const researchInterests = (researchInterestsValue as unknown) as Array<string>;
        if (!researchInterests.includes('Other')) {
            this.setState({
                profile: {
                    ...this.state.profile,
                    researchInterestsOther: null
                }
            }, this.saveProfile.bind(this));
        } else {
            this.setState({
                profile: {
                    ...this.state.profile,
                    researchInterests
                }
            }, this.saveProfile.bind(this));
        }
    };

    // // handles researchInterest onSubmit 
    // researchInterestOnSubmit() {
    //     this.setState({ visibleModal: null }); // close modal

    //     // const profileData = this.props.profileUserdata;
    //     // const newResearchInterests = this.state.profile.researchInterests;

    //     // check if researchInterestOther needs to be in the profileData
    //     if (!this.state.profile.researchInterests.includes('Other')) {
    //         this.setState({
    //             profile: {
    //                 ...this.state.profile,
    //                 researchInterestsOther: null
    //             }
    //         }, this.saveProfile.bind(this));
    //     } else {
    //         this.saveProfile();
    //     }

    //     // // Detect if anything has changed
    //     // if (this.state.profile.researchInterestsOther === profileData.researchInterestsOther &&
    //     //     arraysEqual(this.state.profile.researchInterests, profileData.researchInterests)) {
    //     //     return;
    //     // }

    //     // // Save new values if so
    //     // profileData.researchInterests = this.state.profile.researchInterests;
    //     // profileData.researchInterestsOther = this.state.profile.researchInterestsOther || null;
    //     // this.saveProfile(profileData);
    // };

    /**
     * 
     * Organization 
     */
    // institutionOnSave(selectValue: SelectValue) {
    //     const value = selectValue.toString();
    //     const profileData = this.props.profileUserdata;
    //     if (typeof value !== 'undefined' && value !== profileData.organization) {
    //         profileData.organization = value;
    //         this.saveProfile();
    //     };
    // };

    organizationOnCommit(organization: string | null) {
        // const userdata = this.props.profileUserdata;
        if (organization === this.state.profile.organization) {
            return;
        }

        this.setState({
            profile: {
                ...this.state.profile,
                organization
            }
        }, this.saveProfile.bind(this));
    };

    institutionOnSearch(value: string) {
        if (value.length > 2) {
            const filtered = institutions.filter((item) =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            if (filtered.length <= 30) {
                this.setState({
                    tooManyInstitutionsToRender: false,
                    institutionFiltered: filtered
                });
            } else {
                this.setState({
                    tooManyInstitutionsToRender: true
                });
            }
        };
    };

    // handles jobtitle pulldown menu onChange 
    jobTitleOnChange(value: string) {
        if (this.state.profile.jobTitle !== value) {
            this.setState({
                profile: {
                    ...this.state.profile,
                    jobTitle: value
                }
            }, this.saveProfile.bind(this));
        };
    };

    // handles fundingSource pulldown menu onChange 
    fundingSourceOnChange(fundingSource: string) {
        // fundingSource === this.state.profile.fundingSource;
        this.setState({
            profile: {
                ...this.state.profile,
                fundingSource
            }
        }, this.saveProfile.bind(this));
    };

    renderResearchInterestsModal() {
        if (this.state.visibleModal !== ModalName.ResearchInterests) {
            return;
        }
        return <Modal
            visible={true}
            title='Research Interests'
            closable={false}
            onCancel={this.hideModal.bind(this)}
            footer={[
                <Button key='back'
                    onClick={this.hideModal.bind(this)}>
                    Close
                </Button>
            ]} >
            <Checkbox.Group
                defaultValue={this.state.profile.researchInterests}
                onChange={this.researchInterestOnChange.bind(this)}>
                {researchInterestsList.map((interest) => {
                    return <Checkbox
                        key={interest.value}
                        style={{ display: 'block', marginLeft: '0px' }}
                        value={interest.value} >
                        {interest.label}
                    </Checkbox>;
                })}
            </Checkbox.Group>
            <Input
                placeholder='Other research interests'
                className='margin-top-10px'
                maxLength={50}
                onChange={this.researchInterestsOtherOnChange.bind(this)}
                hidden={this.state.profile.researchInterests.includes('Other') ? false : true}
                defaultValue={this.state.profile.researchInterestsOther || undefined}
            />
        </Modal>;
    }

    renderAvatarModal() {
        if (this.state.visibleModal !== ModalName.AvatarOption) {
            return;
        }
        return <Modal
            visible={true}
            title='Avatar Options'
            closable={false}
            onCancel={() => {
                this.hideModal();
            }}
            footer={[
                <Button key="back"
                    danger
                    onClick={this.hideModal.bind(this)}>
                    Cancel
                </Button>,
                <Button key='submit'
                    id='researchInterests'
                    type='primary'
                    onClick={this.avatarOptionOnSubmit.bind(this)}>
                    Save
                </Button>,
                <div key='tooltip' style={{ width: '100%', marginTop: '2em', textAlign: 'left' }}>

                </div>
            ]}
        >
            <p>Avatar Options</p>
            <Select
                placeholder='Choose to use gravatar, or the KBase anonymous silhouette.'
                disabled={!this.state.isEditing}
                style={{ width: '100%', marginBottom: '2em' }}
                defaultValue={this.state.profile.avatarOption}
                onSelect={this.onSelectAvatarOption.bind(this)}
            >
                {avatarOptions.map((option) => {
                    return <Option value={option.value} key={option.value}>{option.label}</Option>;
                })}
            </Select>
            <p style={{ fontWeight: 'bold' }}>Gravatar Default Image</p>
            <p>If your email address is not registered at gravatar, this generated or generic image will be used instead.</p>

            {/* 
            <div >
                <p>
                    Note that if you have a gravatar image set up, this option will have no effect on your gravatar display.<br />
            Your gravatar is based on an image you have associated with your email address at <a href='https://www.gravatar.com'>Gravatar</a>, a
            free public profile service from Automattic, the same people who brought us Wordpress.
            If you have a personal gravatar associated with the email address in this profile, it will be displayed within KBase.
        </p>
                <p>
                    If you don't have a personal gravatar, you may select one of the default auto-generated gravatars provided below.
                    Note that generated gravatars will use your email address to create a unique gravatar for you,
                    which may be used to identify you in the ui. If you do not wish to have a unique gravatar, you may select 'mystery man' or 'blank'.
        </p>
                
            </div>
            */}
            <Select
                placeholder='Choose to use gravatar, or the KBase anonymous silhouette.'
                disabled={!this.state.isEditing}
                style={{ width: '100%', marginBottom: '2em' }}
                defaultValue={this.state.profile.gravatarDefault}
                onSelect={this.onSelectGravatarDefault.bind(this)}
            >
                {gravatarDefaults.map((option, index) => {
                    return <Option value={option.value} key={index}>{option.label}</Option>;
                })}
            </Select>
        </Modal>;
    }

    toggleEditing() {
        this.setState({
            isEditing: !this.state.isEditing
        });
    }

    renderControls() {
        if (!this.props.editEnable) {
            return;
        }
        let button;
        let bannerText;;
        if (this.state.isEditing) {
            button = <Button
                icon={<CloseOutlined />}
                danger
                onClick={this.toggleEditing.bind(this)}>
                Close Editor
            </Button>;
            bannerText = <span>
                Closing the editor returns your profile to display mode; all edits are saved as you make them.
            </span>;
        } else {
            button = <Button
                icon={<EditOutlined />}
                type="primary"
                onClick={this.toggleEditing.bind(this)}>
                Edit Profile
            </Button>;
            bannerText = <span>
            </span>;
        }

        return <div className="ButtonBar">
            <div className="ButtonBar-button">{button}</div>
            <div className="ButtonBar-text">{bannerText}</div>
        </div>;
    }

    renderAvatarEditor() {
        return <div>
            <div>
                {this.renderAvatarView()}
            </div>
            <div style={{ textAlign: 'center' }}>
                <Button onClick={() => {
                    this.showModal(ModalName.AvatarOption);
                }}>Edit Avatar Options</Button>
            </div>
            {this.renderAvatarModal()}
        </div>;
    }

    renderAvatarView() {
        return <img style={{ maxWidth: '100%', margin: '8px 0px' }}
            alt='avatar'
            src={this.gravatarSrc()}
        />;
    }

    renderAvatar() {
        if (this.state.isEditing) {
            return this.renderAvatarEditor();
        } else {
            return this.renderAvatarView();
        }
    }

    renderResearchInterests() {
        if (this.state.isEditing) {
            return this.renderResearchInterestsEditor();
        } else {
            return this.renderResearchInterestsView();
        }
    }

    renderResearchInterestsEditor() {
        return <div>
            {this.renderResearchInterestsView()}
            <Button onClick={() => {
                this.showModal(ModalName.ResearchInterests);
            }}>Edit Research Interests</Button>
            {this.renderResearchInterestsModal()}
        </div>;
    }

    renderResearchInterestsView() {
        const researchInterests = this.state.profile.researchInterests;

        if (Array.isArray(researchInterests) &&
            researchInterests.length > 0) {
            const normalized = researchInterests.map((interest) => {
                if (interest === 'Other') {
                    return this.state.profile.researchInterestsOther || interest;
                } else {
                    return interest;
                }
            });
            normalized.sort((a, b) => {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });

            return (
                <ul className="PrettyList" >
                    {normalized.map((interest) => {
                        return <li key={interest}>{interest}</li>;
                    })}
                </ul>
            );
        } else {
            return (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No Research Interests" />
            );
        };
    }

    render() {
        return (
            <div className="Profile">
                <div style={{ marginBottom: '10px' }}>
                    {this.renderControls()}
                </div>
                <Row gutter={8} style={{ overflowY: 'auto', flex: '1 1 0px' }}>
                    <Col span={6}>
                        <Area>
                            <div>
                                <div data-k-b-testhook-element="realname" style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                }}>{this.props.userName.name}</div>
                                <div data-k-b-testhook-element="username" style={{
                                    fontFamily: 'monospace',
                                    textAlign: 'center'
                                }}>{this.props.userName.userID}</div>
                                {this.renderAvatar()}

                            </div>
                        </Area>
                        <Area>
                            {this.renderUserNutshell()}
                        </Area>
                    </Col>
                    <Col span={18}>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Area title="Research Interests">
                                    {this.renderResearchInterests()}
                                </Area>
                            </Col>
                            <Col span={12}>
                                <Area title='Organizations' maxHeight='10em'>
                                    <OrgsContainer />
                                </Area>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '8px' }} gutter={8}>
                            <Col span={8}>
                                {this.renderResearchStatement()}
                            </Col>
                            <Col span={16}>
                                {this.renderAffiliations()}
                            </Col>
                        </Row>
                    </Col>
                </Row >
            </div >
        );
    };
};

export default Profile;
