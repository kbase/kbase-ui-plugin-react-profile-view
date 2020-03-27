import React, { CSSProperties } from 'react';
import {
    Row, Col, Card, Input, Tooltip, Form, Checkbox,
    Modal, Select, Button, Empty, message
} from 'antd';
import { UserName, ProfileUserdata, Affiliation } from '../../redux/interfaces';
import nouserpic from '../../assets/nouserpic.png';
import OrgsContainer from '../Orgs/OrgsContainer';
import InputForm2 from './ProfileForms/InputForm2';

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

const { Meta } = Card;
const { Option } = Select;

enum ModalName {
    ResearchInterests,
    AvatarOption,
};

function arraysEqual(a: any, b: any): boolean {
    if (!Array.isArray(a)) {
        return false;
    }
    if (!Array.isArray(b)) {
        return false;
    }

    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

interface Props {
    userName: UserName;
    editEnable: boolean; //true when auth user and userID is equal
    profileUserdata: ProfileUserdata;
    gravatarHash: string;
    profileFetchStatus: string;
    updateProfile: (userdata: ProfileUserdata) => void;
};

interface State {
    visibleModal: ModalName | null;

    // TODO: profile object instead of loose fields
    researchInterestsValue: Array<string>;
    researchInterestsOther: string | undefined;
    jobTitle: string;
    jobTitleOther: string | undefined;
    department: string | null;
    organization: string | null;
    country: string;
    city: string;
    postalCode: string;
    state: string;
    institutionFiltered: Array<string>;
    affiliations: Array<Affiliation>;
    gravatarDefault: string | undefined;
    avatarOption: string | undefined;
    fundingSource: string | null;

    tooManyInstitutionsToRender?: boolean;
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
            researchInterestsValue: [],
            researchInterestsOther: undefined,
            jobTitle: '',
            jobTitleOther: undefined,
            organization: null,
            fundingSource: '',
            country: '',
            city: '',
            postalCode: '',
            state: '',
            institutionFiltered: [],
            affiliations: [],
            department: '',
            gravatarDefault: undefined,
            avatarOption: undefined,
            isEditing: false
        };
    };

    saveProfile(profile: ProfileUserdata) {
        this.props.updateProfile(profile);
        message.success('Saved changes to your Profile');
    }

    componentDidMount() {
        const profile = this.props.profileUserdata;
        this.setState({
            researchInterestsOther: profile.researchInterestsOther || undefined,
            jobTitle: profile.jobTitle,
            jobTitleOther: profile.jobTitleOther,
            organization: profile.organization,
            country: profile.country,
            city: profile.city,
            postalCode: profile.postalCode,
            state: profile.state,
            gravatarDefault: profile.gravatarDefault,
            avatarOption: profile.avatarOption
        });
        if (Array.isArray(profile.researchInterests)) {
            this.setState({ researchInterestsValue: profile.researchInterests });
        };
        if (Array.isArray(profile.affiliations)) {
            this.setState({ affiliations: profile.affiliations });
        };

    };

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
        if (this.state.country === 'United States') {
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
            <Card
                style={{ margin: '8px 0px', textAlign: 'left' }}
                title={this.props.userName.userID ? this.props.userName.userID : ''}
            >
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


                    <InputForm2
                        hidden={this.state.jobTitle === 'Other' ? false : true}
                        type={'string'}
                        required={this.state.jobTitle === 'Other'}
                        userName={this.props.userName}
                        updateStoreState={this.saveProfile.bind(this)} // updates StoreState
                        data={this.props.profileUserdata}
                        stateProperty={'jobTitleOther'}
                        placeHolder='Job Title'
                        label='Position (Other)'
                        defaultValue={this.props.profileUserdata.jobTitleOther}
                        readOnly={!this.props.editEnable}
                        maxLength={50}
                        onBlur={true}
                        onPressEnter={true}
                    />

                    <Tooltip title='must be more than 2 and less than 50 characters'>
                        <InputForm2
                            hidden={false}
                            type={'string'}
                            userName={this.props.userName}
                            updateStoreState={this.saveProfile.bind(this)} // updates StoreState
                            data={this.props.profileUserdata}
                            stateProperty={'department'}
                            label='Department'
                            placeHolder='Department'
                            defaultValue={this.props.profileUserdata.department}
                            readOnly={!this.state.isEditing}
                            maxLength={50}
                            onBlur={true}
                            onPressEnter={true}
                        />
                    </Tooltip>

                    <OrganizationField
                        required={false}
                        defaultValue={this.props.profileUserdata.organization}
                        commit={this.organizationOnCommit.bind(this)} />

                    {/* 
                  
                    <Form.Item
                        // required={true}
                        label='Organization'>
                        <AutoComplete
                        className='margin-top-10px margin-bottom-24px'
                        style={{ width: '100%' }}
                        disabled={!this.state.isEditing}
                        dataSource={this.state.institutionFiltered}
                        placeholder='Organization'
                        onSearch={this.institutionOnSearch.bind(this)}
                        onSelect={this.institutionOnSave.bind(this)}
                        onBlur={this.institutionOnSave.bind(this)}
                        dropdownMatchSelectWidth={false}
                        filterOption={(inputValue, option) => {
                            if (typeof option.props.children === 'string') {
                                let item = option.props.children;
                                return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                            } else {
                                return false;
                            };
                        }}
                        defaultValue={this.props.profileUserdata.organization}
                    >
                        <Input />
                    </AutoComplete>
                    </Form.Item>
                */}

                    <Meta title='Location' style={{ marginBottom: '10px' }} />

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
                                if (typeof option.props.children === 'string') {
                                    let item = option.props.children;
                                    return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                                } else {
                                    return false;
                                }
                            }}

                            defaultValue={this.props.profileUserdata.country}
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
                            mode='default'
                            disabled={!this.state.isEditing}
                            placeholder='State'
                            showArrow
                            onChange={this.stateOnSelect.bind(this)}
                            onSelect={this.stateOnSelect.bind(this)}
                            optionFilterProp='children'
                            filterOption={(inputValue, option) => {
                                if (typeof option.props.children === 'string') {
                                    let item = option.props.children;
                                    return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                                } else {
                                    return false;
                                }
                            }}
                            defaultValue={this.props.profileUserdata.state} >
                            {states.map((item, index) => {
                                return <Option key={index} value={item}>{item}</Option>;
                            })}
                        </Select>
                    </Form.Item>

                    {/* City */}
                    <InputForm2
                        hidden={false}
                        type='string'
                        userName={this.props.userName}
                        updateStoreState={this.saveProfile.bind(this)} // updates StoreState
                        data={this.props.profileUserdata}
                        stateProperty={'city'}
                        placeHolder='City'
                        label="City"
                        defaultValue={this.props.profileUserdata.city}
                        readOnly={!this.state.isEditing}
                        maxLength={85}
                        minLength={0}
                        onBlur={true}
                        onPressEnter={true}
                    />

                    {/* Postal Code */}
                    <InputForm2
                        hidden={false}
                        type={this.props.profileUserdata.postalCode === 'United States' ? 'number' : 'string'}
                        userName={this.props.userName}
                        updateStoreState={this.saveProfile.bind(this)} // updates StoreState
                        data={this.props.profileUserdata}
                        stateProperty={'postalCode'}
                        placeHolder='Postal Code'
                        label="Postal Code"
                        defaultValue={this.props.profileUserdata.postalCode}
                        readOnly={!this.state.isEditing}
                        maxLength={this.props.profileUserdata.country === 'United States' ? 5 : 16}
                        minLength={this.props.profileUserdata.country === 'United States' ? 5 : 0}
                        onBlur={true}
                        onPressEnter={true}
                    />

                    {/* Primary Funding Source */}
                    <Form.Item label="Primary Funding Source">
                        <Select
                            className='margin-top-10px'
                            allowClear
                            mode='default'
                            style={{ width: '100%', marginTop: '10px' }}
                            showSearch
                            disabled={!this.state.isEditing}
                            placeholder='enter 3 or more characters'
                            showArrow={true}
                            onChange={this.fundingSourceOnChange.bind(this)}
                            optionFilterProp='children'
                            filterOption={(inputValue, option) => {
                                if (typeof option.props.children === 'string') {
                                    let str = option.props.children;
                                    return str.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                                } else {
                                    return false;
                                }

                            }}
                            defaultValue={this.props.profileUserdata.fundingSource}
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
            </Card >
        );
    }

    renderUserNutshellViewEmpty() {
        return (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No User Profile" />
        );
    }

    renderUserNutshellView() {
        const profile = this.state;
        const jobTitle = profile.jobTitle ? (<div><Meta title="Position" /><p>{profile.jobTitleOther}</p></div>) : null;
        const department = profile.department ? (<div><Meta title='Department' /><p>{profile.department}</p></div>) : null;
        const organization = profile.organization ? (<div><Meta title='Organization' /><p>{profile.organization}</p></div>) : null;
        const locationFields = [profile.country, profile.state, profile.city].filter(x => x).join(', ');
        const location = locationFields ? (<div><Meta title='Location' /><p>{locationFields}</p></div>) : null;
        const fundingSource = profile.fundingSource ? (<div><Meta title='Primary Funding Source' /><p>{profile.fundingSource}</p></div>) : null;

        if (!(jobTitle || department || organization || location || fundingSource)) {
            return <Card
                style={{ margin: '8px 0px', textAlign: 'left' }}
                title={this.props.userName.userID}>
                {this.renderUserNutshellViewEmpty()}
            </Card>;
        }

        return (
            <Card
                style={{ margin: '8px 0px', textAlign: 'left' }}
                title={this.props.userName.userID}>
                {jobTitle}
                {department}
                {organization}
                {location}
                {fundingSource}
            </Card>
        );
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
        let statement: JSX.Element;
        if (!this.props.profileUserdata.researchStatement || this.props.profileUserdata.researchStatement === '') {
            statement = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Research Statement" />;
        } else {
            // const fixed = this.props.profileUserdata.researchStatement.replace(/\n/, '<br />');
            statement = <p style={{ whiteSpace: 'pre' }}>{this.props.profileUserdata.researchStatement}</p>;
        }

        if (this.state.isEditing) {
            return (
                <Area
                    title='Research or Personal Statement'
                >
                    <Tooltip title='A little bit about yourself and your research'>
                        <TextAreaForm
                            hidden={false}
                            // required={false}
                            userName={this.props.userName}
                            updateStoreState={this.saveProfile.bind(this)}
                            data={this.props.profileUserdata}
                            stateProperty='researchStatement'
                            placeHolder=''
                            defaultValue={this.props.profileUserdata.researchStatement}
                            readOnly={!this.state.isEditing}
                            maxLength={1000}
                            onBlur={true}
                            onPressEnter={true}
                        />
                    </Tooltip>
                </Area>
            );
        } else {
            return (
                <Area
                    title='Research or Personal Statement'
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
            <Card style={{ margin: '8px 0px' }} title='Affiliations'>
                <AffiliationsForm
                    userName={this.props.userName}
                    profileUserdata={this.props.profileUserdata}
                    editEnable={this.state.isEditing}
                    affiliations={this.props.profileUserdata.affiliations}
                    updateStoreState={this.saveProfile.bind(this)}
                /></Card>
        );
    }

    renderAffiliationsView() {
        let affiliationsArray = this.props.profileUserdata.affiliations;
        // non-empty array
        if (affiliationsArray.length > 0 && affiliationsArray[0]['title'] !== '') {
            return (
                <Card style={{ margin: '8px 0px' }} title='Affiliations'>
                    <div id='affiliations'>
                        {affiliationsArray
                            .filter(position => position.title)
                            .map((position, index) => {
                                return <div className='affiliation-row' key={index}>
                                    <p style={{ width: '20%', display: 'inline-block', marginRight: '1em', verticalAlign: 'middle' }}>{position.title}</p>
                                    <p style={{ width: '45%', display: 'inline-block', marginRight: '1em', verticalAlign: 'middle' }}>{position.organization}</p>
                                    <div style={{ width: '29%', display: 'inline-block', verticalAlign: 'text-bottom', whiteSpace: 'nowrap' }}>
                                        <p style={{ display: 'inline', marginRight: '1em' }}>{position.started}</p>
                                        <p style={{ display: 'inline', marginRight: '1em' }}> - </p>
                                        <p style={{ display: 'inline', marginRight: '1em' }}>{position.ended ? position.ended : 'present'}</p>
                                    </div>
                                </div>;
                            })}
                    </div>
                </Card>
            );
        } else {
            return (
                <Card style={{ margin: '8px 0px' }} title='Affiliations'>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Affiliations" />
                </Card>
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

    onSelectAvatarOption(value: string) {
        // validation?
        const newState: State = {
            ...this.state,
            avatarOption: value
        };
        this.setState(newState);
    }

    onSelectGravatarDefault(value: string) {
        // validation?
        const newState: State = {
            ...this.state,
            gravatarDefault: value
        };
        this.setState(newState);
    }

    /**
     *  Updates store state with local avatarOption state 
     *  and gravatarDefault state
     * @param event 
     */
    avatarOptionOnSubmit() {
        // any is used here for creating gereric property 
        let profileData = this.props.profileUserdata;
        if (profileData.gravatarDefault !== this.state.gravatarDefault ||
            profileData.avatarOption !== this.state.avatarOption) {
            if (typeof this.state.gravatarDefault !== 'undefined') {
                profileData.gravatarDefault = this.state.gravatarDefault;
            }
            if (typeof this.state.avatarOption !== 'undefined') {
                profileData.avatarOption = this.state.avatarOption;
            }
            this.saveProfile(profileData);
        };
        this.hideModal();
    };

    countryOnSelect(value: SelectValue) {
        this.countryChanged(value.toString());
    };

    countryChanged(country: string) {
        this.setState({ country });
        let profileData = this.props.profileUserdata;
        profileData.country = country;
        this.saveProfile(profileData);
    }

    stateOnSelect(value: string) {
        const profileData = this.props.profileUserdata;
        profileData.state = value;
        this.saveProfile(profileData);
    };

    /**
     * 
     * research interests
     */
    researchInterestsOtherOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        this.setState({ researchInterestsOther: value.trim() });
    }


    // handles researchInterest check box onChange 
    researchInterestOnChange(event: any) {
        if (!event.includes('Other')) {
            this.setState({ researchInterestsOther: undefined });
        };
        this.setState({ researchInterestsValue: event });
    };

    // handles researchInterest onSubmit 
    researchInterestOnSubmit() {
        this.setState({ visibleModal: null }); // close modal

        const profileData = this.props.profileUserdata;
        const newResearchInterests = this.state.researchInterestsValue;

        // check if researchInterestOther needs to be in the profileData
        if (!newResearchInterests.includes('Other')) {
            this.setState({ researchInterestsOther: undefined });
        }

        // Detect if anything has changed
        if (this.state.researchInterestsOther === profileData.researchInterestsOther &&
            arraysEqual(this.state.researchInterestsValue, profileData.researchInterests)) {
            return;
        }

        // Save new values if so
        profileData.researchInterests = this.state.researchInterestsValue;
        profileData.researchInterestsOther = this.state.researchInterestsOther || null;
        this.saveProfile(profileData);
    };

    /**
     * 
     * Organization 
     */
    institutionOnSave(selectValue: SelectValue) {
        const value = selectValue.toString();
        const profileData = this.props.profileUserdata;
        if (typeof value !== 'undefined' && value !== profileData.organization) {
            profileData.organization = value;
            this.saveProfile(profileData);
        };
    };

    organizationOnCommit(organization: string | null) {
        console.log('committing org', organization);
        const userdata = this.props.profileUserdata;
        if (organization !== userdata.organization) {
            this.setState({
                organization
            });
            const updatedProfile = {
                ...userdata,
                organization
            };
            this.saveProfile(updatedProfile);
        };
    };

    institutionOnSearch(value: string) {
        if (value.length > 2) {
            const filtered = institutions.filter((item) =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            if (filtered.length <= 30) {
                this.setState({ tooManyInstitutionsToRender: false });
                this.setState({ institutionFiltered: filtered });
            } else {
                this.setState({ tooManyInstitutionsToRender: true });
            }
        };
    };

    // handles jobtitle pulldown menu onChange 
    jobTitleOnChange(value: string) {
        const profileData = this.props.profileUserdata;
        if (profileData.jobTitle !== value) {
            profileData.jobTitle = value;
            this.setState({
                jobTitle: value
            });
            this.saveProfile(profileData);
        };
    };

    // handles fundingSource pulldown menu onChange 
    fundingSourceOnChange(value: string) {
        const profileData = this.props.profileUserdata;
        profileData.fundingSource = value;
        this.saveProfile(profileData);
    };

    renderResearchInterestsModal() {
        if (this.state.visibleModal !== ModalName.ResearchInterests) {
            return;
        }
        return <Modal
            // visible={this.state.visibleModal === ModalName.ResearchInterests}
            visible={true}
            title='Research Interests'
            closable={false}
            onCancel={this.hideModal.bind(this)}
            footer={[
                <Button key='back'
                    type="danger"
                    onClick={this.hideModal.bind(this)}>
                    Cancel
                </Button>,
                <Button key='submit'
                    id='researchInterests'
                    type='primary'
                    onClick={this.researchInterestOnSubmit.bind(this)}>
                    Save
                </Button>
            ]} >
            <Checkbox.Group
                // options={researchInterestsList}
                defaultValue={this.props.profileUserdata.researchInterests}
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
                hidden={this.state.researchInterestsValue.includes('Other') ? false : true}
                defaultValue={this.props.profileUserdata.researchInterestsOther || undefined}
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
                    type="danger"
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
                defaultValue={this.props.profileUserdata.avatarOption}
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
                defaultValue={this.props.profileUserdata.gravatarDefault}
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
            // button = <Button icon="eye" onClick={this.toggleEditing.bind(this)}>View</Button>;
            button = <Button icon="close" type="danger" onClick={this.toggleEditing.bind(this)}>Close Editor</Button>;
            bannerText = <span>
                Closing the editor returns your profile to display mode.
            </span>;
        } else {

            button = <Button icon="edit" type="primary" onClick={this.toggleEditing.bind(this)}>Edit Profile</Button>;
            // bannerText = 'View Mode: You are viewing your profile as other users will see it';
            bannerText = <span>

            </span>;

        }

        return <Row gutter={8}>
            <Col span={24}>
                <div className="ButtonBar">
                    <div className="ButtonBar-button">{button}</div>
                    <div className="ButtonBar-text">{bannerText}</div>
                </div>
            </Col>
        </Row>;
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
        const researchInterests = this.props.profileUserdata.researchInterests;
        if (Array.isArray(researchInterests) &&
            researchInterests.length > 0) {
            researchInterests.sort();
            if (researchInterests.includes('Other') && this.props.profileUserdata.researchInterestsOther) {
                return (
                    <ul style={{ textAlign: 'left' }}>
                        {researchInterests.map((interest) => (
                            <li key={interest}>{interest}</li>
                        ))}
                        <ul>
                            <li>
                                {this.props.profileUserdata.researchInterestsOther}
                            </li>
                        </ul>
                    </ul>
                );
            } else {
                return (
                    <ul style={{ textAlign: 'left' }}>
                        {researchInterests.map((interest) => (
                            <li key={interest}>{interest}</li>
                        ))}
                    </ul>
                );
            };

        } else {
            return (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No Research Interests" />
            );
        };
    }

    render() {
        return (
            <Row style={{ padding: 16 }}>
                {this.renderControls()}
                <Row gutter={8}>
                    <Col span={8}>
                        <Card style={{ margin: '8px 0px', textAlign: 'center' }}
                            title={this.props.userName.name ? this.props.userName.name : ''}
                        >
                            {this.renderAvatar()}
                        </Card>
                        {this.renderUserNutshell()}
                    </Col>
                    <Col span={16}>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Area title="Research Interests">
                                    {this.renderResearchInterests()}
                                </Area>
                                {/*
                                <Card className='card-with-height researchInterests' style={{ margin: '8px 0px' }} title='Research Interests'>
                                    {this.renderResearchInterests()}
                                </Card>
                                */}
                            </Col>
                            <Col span={12}>
                                <Card className='card-with-height' style={{ margin: '8px 0px' }} title='Organizations'>
                                    <OrgsContainer />
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            {/* TODO:AKIYO FIX - when the box is very small it doesn't break or hide word */}
                            {this.renderResearchStatement()}
                            {this.renderAffiliations()}
                        </Row>
                    </Col>
                </Row>
            </Row>
        );
    };
};

export default Profile;
