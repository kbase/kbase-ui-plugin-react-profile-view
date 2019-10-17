import React, { CSSProperties } from 'react';
import { Row, Col, Card, Input, Tooltip, Form, Checkbox, Modal, Select, Button, Empty, AutoComplete } from 'antd';
import { UserName, ProfileData, Affiliation } from '../../redux/interfaces';
import nouserpic from '../../assets/nouserpic.png';
import OrgsContainer from '../Orgs/OrgsContainer';
import { InputForm, TextAreaForm, AffiliationForm } from './ProfileForms';

import { researchInterestsList, jobTitles } from '../../profileConfig';
import { fundingSources, countryCodes, institution, states, avatarOptions, gravatarDefaults } from '../../dataSources';

const { Meta } = Card;
const { Option } = Select;


enum ModalName {
    ResearchInterests,
    AvatarOption,
};

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 1 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 23 },
    },
};

interface Props {
    userName: UserName;
    editEnable: boolean; //true when auth user and userID is equal
    profileData: ProfileData;
    gravatarHash: string;
    profileFetchStatus: string;
    updateProfile: (userdata: ProfileData, userName: UserName) => void;
};

interface State {
    visibleModal: ModalName | undefined;
    researchInterestsValue: Array<string>;
    researchInterestsOther: string | undefined;
    jobTitleValue: string;
    jobTitleOther: string | undefined;
    fundingSourceValue: string;
    country: string;
    city: string;
    postalCode: string;
    state: string;
    institutionFiltered: Array<string>;
    affiliations: Array<Affiliation>;
    gravatarDefault: string | undefined;
    avatarOption: string | undefined;
};

/**
 * Returns profile component.
 * @param props
 */
class ProfileClass extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            visibleModal: undefined,
            researchInterestsValue: [],
            researchInterestsOther: undefined,
            jobTitleValue: '',
            jobTitleOther: undefined,
            fundingSourceValue: '',
            country: '',
            city: '',
            postalCode: '',
            state: '',
            institutionFiltered: [],
            affiliations: [],
            gravatarDefault: undefined,
            avatarOption: undefined,
        };

        this.tooltipVisibility = this.tooltipVisibility.bind(this); // tooltip is visible when auth user is using the profile
        this.USStateVisibility = this.USStateVisibility.bind(this); // show/hide us sate select pull down
        this.gravaterSrc = this.gravaterSrc.bind(this); // setting img src for gravater
        this.setName = this.setName.bind(this); // create html element including tooltip to fit in card header 
        this.institutionToolTip = this.institutionToolTip.bind(this);
        this.buildResearchInterests = this.buildResearchInterests.bind(this);
        this.buildUserNutsheel = this.buildUserNutsheel.bind(this);
        this.buildResearchStatement = this.buildResearchStatement.bind(this);
        this.buildAffliations = this.buildAffliations.bind(this);
        this.showModal = this.showModal.bind(this);
        this.setStateProperty = this.setStateProperty.bind(this);
        this.avatarOptionOnSumbit = this.avatarOptionOnSumbit.bind(this);
        this.researchInterestsOtherOnChange = this.researchInterestsOtherOnChange.bind(this);
        this.researchInterestOnChange = this.researchInterestOnChange.bind(this); // update/save value from checkbox group 
        this.researchInterestOnSumbit = this.researchInterestOnSumbit.bind(this);
        this.institutiOnSave = this.institutiOnSave.bind(this);
        this.institutionOnSearch = this.institutionOnSearch.bind(this);
        this.jobTitleOnChange = this.jobTitleOnChange.bind(this); // update/save value from pull down
        this.fundingSourceOnChange = this.fundingSourceOnChange.bind(this);
    };

    componentDidMount() {
        let profile: ProfileData;
        profile = this.props.profileData;

        this.setState({
            researchInterestsOther: profile.researchInterestsOther,
            jobTitleValue: profile.jobTitle,
            jobTitleOther: profile.jobTitleOther,
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
        if (this.props.editEnable === false) {
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
    gravaterSrc() {
        if (this.props.profileData['avatarOption'] === 'silhoutte' || !this.props.gravatarHash) {
            // let gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={nouserpic} />;
            return nouserpic;
        } else if (this.props.gravatarHash) {
            return 'https://www.gravatar.com/avatar/' + this.props.gravatarHash + '?s=300&amp;r=pg&d=' + this.props.profileData.gravatarDefault;
            // let gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={gravaterSrc} />;
        };
    };

    /**
     * set name field to either input field or 
     * plain text depending on if auth-user is viewing or not
     */
    setName() {
        if (this.props.editEnable) {
            return (
                <Tooltip title='must be less than 100 characters'>
                    <Input
                        className='clear-disabled ant-card-meta-title'
                        readOnly={this.props.editEnable}
                        maxLength={100}
                        defaultValue={this.props.userName.name ? this.props.userName.name : ''}
                    />
                </Tooltip>
            );
        } else {
            return (<div className='name ant-card-meta-title'>{this.props.userName.name}</div>);
        };
    };

    // Create tootip for Organization Auto Complete
    institutionToolTip() {
        return (
            <div>
                <p>Your primary association - organization, institution, business.<br />
                    You may enter your own value or chose from the option fileted by your entry.<br />
                    National Labs derived from: <a href='https://science.energy.gov/laboratories/' target='_blank'>DOE Web Site - Laboratories</a><br />
                    US higher education institutions derived from: <a href='http://carnegieclassifications.iu.edu/index.php' target='_blank'>Carnegie Classification of Institutions of Higher Education </a>
                </p>
            </div>
        );
    };
    
    /**
     * populate research interest and handles case that prop is empty
     */
    buildResearchInterests() {
        let researchInterests: Array<string> = [];
        if (Array.isArray(this.props.profileData.researchInterests)) {
            researchInterests = this.props.profileData.researchInterests;
            if (researchInterests.includes('Other')) {
                return (
                    <ul style={{ textAlign: 'left' }}>
                        {researchInterests.map((interest) => (
                            <li key={interest}>{interest}</li>
                        ))}
                        <ul>
                            <li>
                                {this.props.profileData.researchInterestsOther}
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
                <div><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
            );
        };
    };

    /**
     * builds User Nutshell card
     *  - Choose between the non-auth user profile  
     *    vs. editable user profile 
     *  - Return either form or plain text
     */
    buildUserNutsheel() {
        if (this.props.editEnable) {
            return (
                <Card
                    style={{ margin: '8px 0px', textAlign: 'left' }}
                    title={this.setName()}
                >
                    <Meta title='User ID' />
                    <Tooltip title='User ID cannot be changed'>
                        {/* this might null or undefined or empty string */}
                        <Input readOnly={this.props.userName ? true : false} className='clear-disabled marginTop10px margin-bottom-24px userID' placeholder='User ID' defaultValue={this.props.userName.userID ? this.props.userName.userID : ''} />
                    </Tooltip>
                    <Meta title='Position' />
                    <Select
                        className='clear-disabled'
                        placeholder='Job title'
                        disabled={!this.props.editEnable}
                        style={{ width: '100%', marginTop: '10px' }}
                        defaultValue={this.props.profileData.jobTitle}
                        onChange={this.jobTitleOnChange}
                    >
                        {jobTitles.map((item) => {
                            return <Option key={item.label} value={item.value}>{item.label}</Option>
                        })}
                    </Select>
                    <InputForm
                        hidden={this.state.jobTitleValue === 'Other' ? false : true}
                        type={'string'}
                        required={false}
                        userName={this.props.userName}
                        updateStoreState={this.props.updateProfile} // updates StoreState
                        data={this.props.profileData}
                        stateProperty={'jobTitleOther'}
                        placeHolder='Job Title'
                        defaultValue={this.props.profileData.jobTitleOther}
                        readOnly={this.props.editEnable} //TODO: PUT THIS BACK
                        maxLength={50}
                        onBlur={true}
                        onPressEnter={true}
                    />
                    <Meta title='Department' />
                    <Tooltip title='must be more than 2 and less than 50 characters'>
                        <InputForm
                            hidden={false}
                            type={'string'}
                            required={false}
                            userName={this.props.userName}
                            updateStoreState={this.props.updateProfile} // updates StoreState
                            data={this.props.profileData}
                            stateProperty={'department'}
                            placeHolder='Department'
                            defaultValue={this.props.profileData.department}
                            readOnly={!this.props.editEnable}
                            maxLength={50}
                            onBlur={true}
                            onPressEnter={true}
                        />
                    </Tooltip>
                    <Meta title='Organization' />
                    <Tooltip placement='top' title={<this.institutionToolTip />}>
                        <div></div> {/* i don't know why this empty div has to be here for tooltip to showup  */}
                        <AutoComplete
                            className='clear-disabled marginTop10px margin-bottom-24px'
                            style={{ width: '100%' }}
                            disabled={this.props.editEnable}//TODO: PUT THIS BACK~!
                            allowClear
                            dataSource={this.state.institutionFiltered}
                            placeholder='Organization'
                            onSearch={this.institutionOnSearch}
                            onSelect={this.institutiOnSave}
                            onBlur={this.institutiOnSave}
                            filterOption={(inputValue, option) => {
                                if (typeof option.props.children === 'string') {
                                    let item = option.props.children;
                                    return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                                } else {
                                    return false;
                                };
                            }}
                            defaultValue={this.props.profileData.organization}
                        >
                            <Input />
                        </AutoComplete>
                    </Tooltip>
                    <Meta title='Location' />
                    <Tooltip title='Search Country'>
                        <Form.Item className='profile-input-form' required={true} {...formItemLayout} label=' '>
                            <AutoComplete
                                className='clear-disabled marginTop10px'
                                style={{ width: '100%' }}
                                disabled={!this.props.editEnable}
                                allowClear
                                placeholder='Country'
                                onChange={(value) => { this.setStateProperty('country', value as string) }}
                                onSelect={(value) => { this.setStateProperty('country', value as string) }}
                                filterOption={(inputValue, option) => {
                                    if (typeof option.props.children === 'string') {
                                        let item = option.props.children;
                                        return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                                    } else {
                                        return false
                                    }
                                }}
                                defaultValue={this.props.profileData.country}
                            >
                                {Array.from(countryCodes).map((item => {
                                    return (
                                        <Option key={item[1]} value={item[0]}>
                                            {item[0]}
                                        </Option>
                                    );
                                }))}
                            </AutoComplete></Form.Item>
                    </Tooltip>
                    <Tooltip trigger='hover' title='Search US States'>
                        <Form.Item className='profile-input-form' required={true} {...formItemLayout} label=' '>
                            <Select
                                className='clear-disabled marginTop10px margin-bottom-24px'
                                mode='single'
                                style={this.USStateVisibility()}
                                disabled={!this.props.editEnable}
                                allowClear
                                placeholder='State'
                                showArrow={true}
                                onSelect={(value: string) => { this.setStateProperty('state', value) }}
                                optionFilterProp='children'
                                filterOption={(inputValue, option) => {
                                    if (typeof option.props.children === 'string') {
                                        let item = option.props.children;
                                        return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                                    } else {
                                        return false
                                    }

                                }}
                                defaultValue={this.props.profileData.state}
                            >
                                {states.map((item, index) => {
                                    return <Option key={index} value={item}>{item}</Option>
                                })}
                            </Select></Form.Item>
                    </Tooltip>
                    <InputForm
                        hidden={false}
                        type='string'
                        required={true}
                        userName={this.props.userName}
                        updateStoreState={this.props.updateProfile} // updates StoreState
                        data={this.props.profileData}
                        stateProperty={'city'}
                        placeHolder='City'
                        defaultValue={this.props.profileData.city}
                        readOnly={!this.props.editEnable}
                        maxLength={85}
                        minLength={0}
                        onBlur={true}
                        onPressEnter={true}
                    />
                    <InputForm
                        hidden={false}
                        type={this.state.country === 'United States' ? 'number' : 'string'}
                        required={true}
                        userName={this.props.userName}
                        updateStoreState={this.props.updateProfile} // updates StoreState
                        data={this.props.profileData}
                        stateProperty={'postalCode'}
                        placeHolder='Postal Code'
                        defaultValue={this.props.profileData.postalCode}
                        readOnly={!this.props.editEnable}
                        maxLength={this.state.country === 'United States' ? 5 : 16}
                        minLength={this.state.country === 'United States' ? 5 : 0}
                        onBlur={true}
                        onPressEnter={true}
                    />
                    <Meta title='Primary Funding Source' />
                    <Select
                        className='clear-disabled marginTop10px'
                        mode='single'
                        style={{ width: '100%', marginTop: '10px' }}
                        showSearch
                        disabled={!this.props.editEnable}
                        maxTagCount={20}
                        placeholder='enter more than 3 characters'
                        showArrow={true}
                        onChange={this.fundingSourceOnChange}
                        optionFilterProp='children'
                        filterOption={(inputValue, option) => {
                            // return true;
                            if (typeof option.props.children === 'string') {
                                let str = option.props.children;
                                return str.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                            } else {
                                return false
                            }

                        }}
                        defaultValue={this.props.profileData.fundingSource}
                    >
                        {fundingSources.map((item) => {
                            return (
                                <Option key={item['value']} value={item['value']}>
                                    {item['value']}
                                </Option>
                            );
                        })}
                    </Select>
                </Card>
            );
        } else {
            let profile = this.props.profileData;
            let hasLocation = () => {
                if (profile.country || profile.state || profile.city) {
                    return true;
                } else {
                    return false;
                };
            };
            return (
                <Card
                    style={{ margin: '8px 0px', textAlign: 'left' }}
                    title={this.setName()}
                >
                    <div>
                        <p>{this.props.userName.userID}</p>
                        <p style={{ fontStyle: "italic" }}>{profile.jobTitleOther ? profile.jobTitleOther : profile.jobTitle}</p>
                        <p>{profile.organization}<br />
                            {profile.department}</p>
                    </div>
                    <div>
                        {hasLocation() ? (<h4>Location</h4>) : null}
                        <p>{profile.country ? profile.country + ', ' : null}{profile.state ? profile.state + ', ' : null}{profile.city ? profile.city : null}</p>
                    </div>
                    <div>
                        {profile.fundingSource ? (<h4>Primary Funding Source</h4>) : null}
                        <p>{profile.fundingSource}</p>
                    </div>
                </Card>
            );
        };
    };


    /**
     * builds research statement card
     *  - Choose between the non-auth user profile  
     *    vs. editable user profile 
     *  - Return either form or plain text
     */
    buildResearchStatement() {
        if (this.props.editEnable) {
            return (
                <Card
                    style={{ margin: '8px 0px' }}
                    title='Research or Personal Statement'
                >
                    <Tooltip title='A little bit about yourself and your research'>
                        <TextAreaForm
                            hidden={false}
                            type='string'
                            required={false}
                            userName={this.props.userName}
                            updateStoreState={this.props.updateProfile}
                            data={this.props.profileData}
                            stateProperty='researchStatement'
                            placeHolder=''
                            defaultValue={this.props.profileData.researchStatement}
                            readOnly={!this.props.editEnable}
                            maxLength={1000}
                            onBlur={true}
                            onPressEnter={true}
                        />
                    </Tooltip>
                </Card>
            );
        } else {
            return (
                <Card
                    style={{ margin: '8px 0px' }}
                    title='Research or Personal Statement'
                >
                    <p>{this.props.profileData.researchStatement}</p>
                </Card>
            );
        };
    };

    /**
     * builds affliations card
     *  - Choose between the non-auth user profile  
     *    vs. editable user profile 
     *  - Return either form or plain text
     */
    buildAffliations() {
        if (this.props.editEnable) {
            return (
                <Card style={{ margin: '8px 0px' }} title='Affiliations'>
                    <AffiliationForm
                        userName={this.props.userName}
                        profileData={this.props.profileData}
                        editEnable={this.props.editEnable}
                        affiliations={this.props.profileData.affiliations}
                        updateStoreState={this.props.updateProfile}
                    /></Card>
            );
        } else {
            let affiliations = this.props.profileData.affiliations;
            // TODOL change BFF so that it will return an empty array when there is no data
            // so instead of using this -> affiliations[0]['title'], affiliations.length > 0

            // non-empty array
            if (affiliations[0]['title'] !== '') {
                return (
                    <Card style={{ margin: '8px 0px' }} title='Affiliations'>
                        <div id='affiliations'>
                            {affiliations.map((position) => {
                                return (
                                    <div className='affiliation-row'>
                                        <p style={{ width: '25%', marginRight: "1em" }}>{position.title}</p><p style={{ flexGrow: 1 }}>{position.organization}</p><p style={{ width: '90px' }}>{position.started} </p><p style={{ width: '90px' }}>{position.ended ? position.ended : 'present'}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                );
            } else {
                return (
                    <Card style={{ margin: '8px 0px' }} title='Affiliations'>
                        <div><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
                    </Card>
                );
            };
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
    showModal(event: any, modal: ModalName | undefined) {
        if (this.props.editEnable === true) {
            this.setState({ visibleModal: modal });
        };
    };

    /**
     * updates/saves local state
     * @param propertyName 
     * @param value 
     */
    setStateProperty(propertyName: string, value: string) {
        // any is used here for creating gereric property 
        let newState: any = { [propertyName]: value.trim() };
        this.setState(newState);
    };

    /**
     *  Updates store state with local avatarOption state 
     *  and gravatarDefault state
     * @param event 
     */
    avatarOptionOnSumbit() {
        // any is used here for creating gereric property 
        let profileData = this.props.profileData;
        if (profileData.gravatarDefault !== this.state.gravatarDefault ||
            profileData.avatarOption !== this.state.avatarOption) {
            if (typeof this.state.gravatarDefault !== 'undefined') profileData.gravatarDefault = this.state.gravatarDefault;
            if (typeof this.state.avatarOption !== 'undefined') profileData.avatarOption = this.state.avatarOption;
            this.props.updateProfile(profileData, this.props.userName);
        };
    };

    /**
     * 
     * research interests
     */
    researchInterestsOtherOnChange(event: any) {
        if (typeof event.target.value === 'string') {
            this.setState({ researchInterestsOther: event.target.value });
        };
    };

    // handles researchInterest check box onChange 
    researchInterestOnChange(event: any) {
        if (!event.includes('Other')) { this.setState({ researchInterestsOther: undefined }) };
        this.setState({ researchInterestsValue: event });
    };

    // handles researchInterest onSubmit 
    researchInterestOnSumbit(event: any) {
        this.setState({ visibleModal: undefined }) // close modal
        let profileData: any = this.props.profileData;
        let arrState = this.state.researchInterestsValue;
        let arrProps = profileData.researchInterests;

        // check if researchInterestOther needs to be in the profileData
        if (!arrState.includes('Other')) { this.setState({ researchInterestsOther: undefined }) };

        if (arrState.length !== arrProps.length || profileData.researchInterestsOther !== this.state.researchInterestsOther) {
            profileData.researchInterests = arrState;
            profileData.researchInterestsOther = this.state.researchInterestsOther;
            this.props.updateProfile(profileData, this.props.userName);
        } else {
            for (let i = 0; i < arrState.length; i++) {
                if (arrState[i] !== arrProps[i]) {
                    profileData.researchInterests = arrState;
                    profileData.researchInterestsOther = this.state.researchInterestsOther;
                    this.props.updateProfile(profileData, this.props.userName);
                    break;
                };
            };
        };
    };

    /**
     * 
     * Organization 
     */
    institutiOnSave(event: any) {
        let profileData = this.props.profileData;
        if (typeof event !== 'undefined' && event !== profileData.organization) {
            profileData.organization = event;
            this.props.updateProfile(profileData, this.props.userName);
        };
    };

    institutionOnSearch(event: any) {
        if (event.length > 2) {
            let arr = [];
            arr = institution.filter(item =>
                item.toLowerCase().includes(event.toLowerCase())
            );
            if (arr.length <= 30) {
                this.setState({ institutionFiltered: arr });
            };
        };
    };

    // handles jobtitle pulldown menu onChange 
    jobTitleOnChange(value: string) {
        let profileData = this.props.profileData;
        if (profileData.jobTitle !== value) {
            profileData.jobTitle = value;
            this.props.updateProfile(profileData, this.props.userName);
        };
    };

    // handles fundingSource pulldown menu onChange 
    fundingSourceOnChange(event: any) {
        let profileData = this.props.profileData;
        profileData.fundingSource = event;
        this.props.updateProfile(profileData, this.props.userName);
    };

    render() {
        return (
            <Row style={{ padding: 16 }}>
                <Row gutter={8}>
                    <Col span={8}>
                        <Card style={{ margin: '8px 0px', textAlign: 'center' }}>
                            <Tooltip overlayStyle={this.tooltipVisibility()} title='click to edit Avatar Options'>
                                <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={this.gravaterSrc()} onClick={(event) => { this.showModal(event, ModalName.AvatarOption) }} />
                                {/* {gravatar} */}
                            </Tooltip>
                            <Modal
                                visible={this.state.visibleModal === ModalName.AvatarOption}
                                title='Avatar Options'
                                closable={false}
                                onCancel={(event) => { this.showModal(event, undefined) }}
                                footer={[
                                    <Button key='back' onClick={(event) => { this.showModal(event, undefined) }}>
                                        Return
                                    </Button>,
                                    <Button key='submit' id='researchInterests' type='primary' onClick={this.avatarOptionOnSumbit}>
                                        Save
                                    </Button>,
                                    <div key='tooltop' style={{ width: '100%', marginTop: '2em', textAlign: 'left' }}>
                                        <p>If you do not have a custom gravatar, this generated or generic image will be used.<br />
                                            Note that if you have a gravatar image set up, this option will have no effect on your gravatar display.<br />
                                            Your gravatar is based on an image you have associated with your email address at <a href='https://www.gravatar.com'>Gravatar</a>, a
                                            free public profile service from Automattic, the same people who brought us Wordpress.
                                            If you have a personal gravatar associated with the email address in this profile, it will be displayed within KBase.
                                        <br />
                                            If you don't have a personal gravator, you may select one of the default auto-generated gravatars provided below.
                                                Note that generated gravatars will use your email address to create a unique gravatar for you,
                                                which may be used to identify you in the ui. If you do not wish to have a unique gravatar, you may select 'mystery man' or 'blank'.
                                        </p>
                                    </div>,
                                ]}
                            >
                                <p>Avatar Options</p>
                                <Select
                                    className='clear-disabled'
                                    placeholder='Choose to use gravatar, or the KBase anonymous silhouette.'
                                    disabled={!this.props.editEnable}
                                    style={{ width: '100%', marginBottom: '2em' }}
                                    defaultValue={this.props.profileData.avatarOption}
                                    onSelect={(value: string) => { this.setStateProperty('avatarOption', value) }}
                                >
                                    {avatarOptions.map((option, index) => {
                                        return <Option key={index}>{option.label}</Option>
                                    })}
                                </Select>
                                <p>Gravator Default Image</p>
                                <Select
                                    className='clear-disabled'
                                    placeholder='Choose to use gravatar, or the KBase anonymous silhouette.'
                                    disabled={!this.props.editEnable}
                                    style={{ width: '100%', marginBottom: '2em' }}
                                    defaultValue={this.props.profileData.gravatarDefault}
                                    onSelect={(value: string) => { this.setStateProperty('gravatarDefault', value) }}
                                >
                                    {gravatarDefaults.map((option, index) => {
                                        return <Option key={index}>{option.label}</Option>
                                    })}
                                </Select>
                            </Modal>
                        </Card>
                        {this.buildUserNutsheel()}
                    </Col>
                    <Col span={16}>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Card className='card-with-height researchInterests' style={{ margin: '8px 0px' }} title='Research Interests'>
                                    <Tooltip overlayStyle={this.tooltipVisibility()} title='Click to select research interests'>
                                        <div id='researchInterests' onClick={(event) => { this.showModal(event, ModalName.ResearchInterests) }} >
                                            {this.buildResearchInterests()}
                                        </div>
                                    </Tooltip>
                                    <Modal
                                        visible={this.state.visibleModal === ModalName.ResearchInterests}
                                        title='Research Interests'
                                        closable={false}
                                        onCancel={(event) => { this.showModal(event, undefined) }}
                                        footer={[
                                            <Button key='back' onClick={(event) => { this.showModal(event, undefined) }}>
                                                Return
                                            </Button>,
                                            <Button key='submit' id='researchInterests' type='primary' onClick={this.researchInterestOnSumbit}>
                                                Submit
                                            </Button>,
                                        ]}
                                    >
                                        <Checkbox.Group
                                            options={researchInterestsList}
                                            defaultValue={this.props.profileData.researchInterests}
                                            onChange={this.researchInterestOnChange}
                                        />
                                        <Input
                                            placeholder='Other research interests'
                                            className='marginTop10px'
                                            maxLength={50}
                                            onChange={this.researchInterestsOtherOnChange}
                                            hidden={this.state.researchInterestsValue.includes('Other') ? false : true}
                                            defaultValue={this.props.profileData.researchInterestsOther}
                                            value={this.state.researchInterestsOther}
                                        />
                                    </Modal>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card className='card-with-height' style={{ margin: '8px 0px' }} title='Organizations'>
                                    <OrgsContainer />
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            {/* TODO:AKIYO FIX - when the box is very small it doesn't break or hide word */}
                            {this.buildResearchStatement()}
                            {this.buildAffliations()}
                        </Row>
                    </Col>
                </Row>
            </Row>
        );
    };
};

export default ProfileClass;
