import React, { CSSProperties } from 'react';
import { Row, Col, Card, Input, Tooltip, Form, Checkbox, Modal, Select, Button, Empty, AutoComplete } from 'antd';
import { FormItemProps } from 'antd/es/form';
import { UserName, ProfileData, Affiliation } from '../../redux/interfaces';
import nouserpic from '../../assets/nouserpic.png';
import OrgsContainer from '../Orgs/OrgsContainer';
import { maxInputLength, researchInterestsList, jobTitles } from '../../profileConfig';
import { fundingSources, countryCodes, institution } from '../../dataSources';

const { Meta } = Card;
const { TextArea } = Input;
const { Option } = Select;


interface Props {
    userName: UserName;
    editEnable: boolean; //true when auth user and userID is equal
    profileData: ProfileData;
    gravatarHash: string;
    profileFetchStatus: string;
    updateProfile: (profileID: string, userdata: ProfileData) => void;
};

interface State {
    profileDataKeySet: Set<string>
    researchInterestsModalVisible: boolean;
    researchInterestsValue: Array<string>; // value returned by onChange
    researchInterestsOther: string | undefined;
    jobTitleValue: string; // value returned by onChange
    jobTitleOther: string | undefined;
    fundingSourceValue: string; // value returned from pulldown
    locationSuggestions: Array<string>;
    countryCode: string;
    institutionFiltered: Array<string>;
    affiliations: Array<Affiliation>;
}

/**
 * Returns profile component.
 * @param props
 */
class ProfileClass extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            profileDataKeySet: new Set(),
            researchInterestsModalVisible: false,
            researchInterestsValue: [],
            researchInterestsOther: undefined,
            jobTitleValue: '',
            jobTitleOther: undefined,
            fundingSourceValue: '',
            locationSuggestions: [],
            countryCode: '',
            institutionFiltered: [],
            affiliations: [],
        };

        this.tooltipVisibility = this.tooltipVisibility.bind(this); // tooltip is visible when auth user is using the profile
        this.gravaterSrc = this.gravaterSrc.bind(this); // setting img src for gravater
        this.setName = this.setName.bind(this); // creating html element including tooltip to fit in card header 
        this.affiliations = this.affiliations.bind(this); // handles no-data or underfined data and populate data
        this.researchInterests = this.researchInterests.bind(this); // handles no-data or underfined data and populate data
        this.institutionToolTip = this.institutionToolTip.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.jobTitleOnChange = this.jobTitleOnChange.bind(this); // update/save value from pull down
        this.jobTitleOtherOnChange = this.jobTitleOtherOnChange.bind(this); // update/save value from input field 
        this.jobTitleOnSubmit = this.jobTitleOnSubmit.bind(this) // handles on sumbit job titles
        this.foo = this.foo.bind(this);
        this.researchInterestOnSumbit = this.researchInterestOnSumbit.bind(this);
        this.researchInterestsOtherOnChange = this.researchInterestsOtherOnChange.bind(this);
        this.researchInterestOnChange = this.researchInterestOnChange.bind(this); // update/save value from checkbox group 
        this.locationOnSearch = this.locationOnSearch.bind(this)
        this.fundingSourceOnChange = this.fundingSourceOnChange.bind(this);
        this.countryCodeOnChange = this.countryCodeOnChange.bind(this);
        this.institutionOnChange = this.institutionOnChange.bind(this);
        this.institutionOnSearch = this.institutionOnSearch.bind(this);
        this.hoo = this.hoo.bind(this);
    };

    componentDidMount() {
        console.log('profile props', this.props)
        let profile: ProfileData;
        profile = this.props.profileData;

        let newDataKeySet: Set<string> = new Set();
        for (let item in profile) {
            newDataKeySet.add(item);
        };
        this.setState({
            researchInterestsOther: profile.researchInterestsOther,
            jobTitleValue: profile.jobTitle,
            jobTitleOther: profile.jobTitleOther,
            profileDataKeySet: newDataKeySet
        })
        if (typeof profile.researchInterests !== 'undefined' &&
            Array.isArray(profile.researchInterests)) {
            this.setState({ researchInterestsValue: profile.researchInterests })
        };
        if (typeof profile.affiliations !== 'undefined' &&
            Array.isArray(profile.affiliations)) {
            this.setState({ affiliations: profile.affiliations });
        };

        this.tooltipVisibility();
    };

    // if you're going ot use prevProps, prevState
    // you need to put all these three for typescript to be happy.
    componentDidUpdate(prevProps: Props, prevState: State, snapshot: any) {
        console.log('componenetupdate', this.state)
    };

    hoo(event: any) {
        event.preventDefault();
        console.log(event, event.target)
    }

    /**
     * if profile is auth user's profile, then edit is enabled, then make tool tips visible
     */
    tooltipVisibility(): CSSProperties {
        if (this.props.editEnable === false) {
            return { visibility: 'hidden' };
        } else {
            return { visibility: 'visible' };
        };
    };

    // Set gravatarURL
    gravaterSrc() {
        if (this.props.profileData['avatarOption'] === 'silhoutte' || !this.props.gravatarHash) {
            // let gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt="avatar" src={nouserpic} />;
            return nouserpic
        } else if (this.props.gravatarHash) {
            return 'https://www.gravatar.com/avatar/' + this.props.gravatarHash + '?s=300&amp;r=pg&d=' + this.props.profileData.gravatarDefault;
            // let gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt="avatar" src={gravaterSrc} />;
        }
        return 'https://www.gravatar.com/avatar/' + this.props.gravatarHash + '?s=300&amp;r=pg&d=' + this.props.profileData.gravatarDefault;
    };

    // Set name and tooltip 
    setName() {
        return (
        <Tooltip overlayStyle={this.tooltipVisibility()} title='must be less than 100 characters'>
            <Input
                className="clear-disabled"
                readOnly={this.props.editEnable}
                maxLength={maxInputLength.name}
                onBlur={this.handleOnBlur}
                onPressEnter={this.handleOnBlur}
                defaultValue={this.props.userName.name}
            />
        </Tooltip>);
    };

    // Create Tooltop for Organization auto complete
    institutionToolTip() {
        return (
            <div>
                <p>Your primary association - organization, institution, business.<br />
                    You may enter your own value or chose from the option fileted by your entry.<br />
                    National Labs derived from: <a href="https://science.energy.gov/laboratories/" target="_blank">DOE Web Site - Laboratories</a><br />
                    US higher education institutions derived from: <a href="http://carnegieclassifications.iu.edu/index.php" target="_blank">Carnegie Classification of Institutions of Higher Education </a>
                </p>
            </div>
        );
    };

    // populate affiliations and handles case that affiliations list prop is empty
    affiliations() {
        if (typeof this.state.affiliations !== 'undefined' && Array.isArray(this.state.affiliations)) {
            return (
                <div id='affiliations'>
                    {this.state.affiliations.map((position, index) => (
                        <form key={index} className='affiliations' name={index.toString(10)} autoComplete="on">
                            <Input
                                readOnly={!this.props.editEnable}
                                style={{ width: '20%', display: 'inline' }}
                                autoComplete='organization-title'
                                type='text'
                                className='clear-disabled'
                                maxLength={maxInputLength.position}
                                defaultValue={position.title}
                                placeholder={'Job title'}
                                onChange={(item) => { this.affiliationJobTitleOnChange(item, index) }}
                            />
                            <AutoComplete
                                className='clear-disabled'
                                style={{ width: '50%' }}
                                allowClear
                                disabled={!this.props.editEnable}
                                placeholder='Search or enter your organization.'
                                onSelect={(item) => { this.affiliationOnSelect(item, index) }}
                                onSearch={this.institutionOnSearch}
                                filterOption={(inputValue, option) => {
                                    // return true;
                                    if (typeof option.props.children === 'string') {
                                        let item = option.props.children;
                                        return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                                    } else {
                                        return false
                                    }

                                }}
                                defaultValue={position.organization}
                            >
                                {this.state.institutionFiltered.map((item) => {
                                    return (
                                        <Option className='clear-disabled' value={item} >
                                            {item}
                                        </Option>
                                    );
                                })}
                            </AutoComplete>
                            <Input
                                readOnly={!this.props.editEnable}
                                style={{ width: '60px', display: 'inline' }}
                                name={index.toString(10)}
                                onChange={(item) => { this.affiliationStartOnChange(item, index, 'start') }}
                                type='string' maxLength={4}
                                className='clear-disabled'
                                placeholder='Year started'
                                defaultValue={position.started}
                            />
                            <Input
                                readOnly={!this.props.editEnable}
                                style={{ width: '60px', display: 'inline' }}
                                name={index.toString(10)}
                                onChange={(item) => { this.affiliationEndOnChange(item, index) }}
                                type='string' maxLength={4}
                                className='clear-disabled'
                                placeholder='Year ended'
                                defaultValue={position.ended}
                            />
                            <Button hidden={this.showEditButtons()} style={{ margin: '10px' }} type="primary" onClick={() => this.deleteAffiliation(index)}>
                                delete
                            </Button>
                        </form>
                    ))}
                </div>
            )
        } else {
            return (
                <div><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
            );
        };
    };



    // populate research interest and handles case that prop is empty
    researchInterests() {
        let researchInterests: Array<string> = [];
        if (typeof this.props.profileData.researchInterests !== 'undefined' && Array.isArray(this.props.profileData.researchInterests)) {
            researchInterests = this.props.profileData.researchInterests;
            if (researchInterests.includes("Other")) {
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
    }


    // Modal Control  
    showModal(event: any) {
        if (this.props.editEnable == true) {
            this.setState({ researchInterestsModalVisible: true })
        };
    };

    closeModal(event: any) {
        this.setState({ researchInterestsModalVisible: false });
    };

    /// event handlers //// 

    /**
     * Handles onBlur or onPressEnter event
     * saves and update the profile data
     * @param event 
     */
    handleOnBlur(event: any) {
        let elem = event.target;
        let profileData: any = this.props.profileData;
        for (let i = 0; i < elem.classList.length; i++) {
            let targetClass = elem.classList[i];
            if (this.state.profileDataKeySet.has(targetClass) && profileData[targetClass] !== elem.value) {
                profileData[targetClass] = elem.value.trim();
                this.props.updateProfile(this.props.userName.userID, profileData);
            };
        };
    };

    /**
     * Location 
     * 
     */
    async locationOnSearch(value: string) {
        if (value.length > 3) {
            let suggestionsArr = [];
            let url = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json?app_id=OsLgmo5czpVQ8Ofqvn7M&app_code=KR4vdU7nGqr_PRriINGH9Q&query=';
            let fetchURL = url + value + "&=" + this.state.countryCode + "callback=mycallbackFunction";
            let result = await fetch(fetchURL, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'content-type': 'application/json'
                }
            });
            console.log(result)
            try {
                let suggestions = await result.json();
                console.log(suggestions)
                suggestionsArr = suggestions['suggestions']
            } catch (error) {
                console.error('humm')
            }
            let arr = [];
            for (let i = 0; i < suggestionsArr.length; i++) {
                arr.push(suggestionsArr[i].label)
            }
            this.setState({ locationSuggestions: arr })
        };

    }

    // handles country code pull down menu
    countryCodeOnChange(event: any) {
        if (typeof event !== 'undefined') {
            this.setState({ countryCode: event });
        };
    };


    /**
     * 
     * research interests
     */
    researchInterestsOtherOnChange(event: any) {
        // during developement, "[Object object]" managed to get into the state
        if (typeof event.target.value !== 'object' || typeof event.target.value !== 'undefined') {
            this.setState({ researchInterestsOther: event.target.value })
        }
    }
    // handles researchInterest check box onChange 
    researchInterestOnChange(event: any) {
        if (!event.includes('Other')) { this.setState({ researchInterestsOther: undefined }) }
        this.setState({ researchInterestsValue: event });
    };

    // handles researchInterest onSubmit 
    researchInterestOnSumbit(event: any) {
        this.setState({ researchInterestsModalVisible: false }) // close modal
        let profileData: any = this.props.profileData;
        let arrState = this.state.researchInterestsValue;
        let arrProps = profileData.researchInterests;

        // check if researchInterestOther needs to be in the profileData
        if (!arrState.includes('Other')) { this.setState({ researchInterestsOther: undefined }) };

        if (arrState.length !== arrProps.length || profileData.researchInterestsOther !== this.state.researchInterestsOther) {
            profileData.researchInterests = arrState;
            profileData.researchInterestsOther = this.state.researchInterestsOther;
            this.props.updateProfile(this.props.userName.userID, profileData);
        } else {
            for (let i = 0; i < arrState.length; i++) {
                if (arrState[i] !== arrProps[i]) {
                    profileData.researchInterests = arrState;
                    profileData.researchInterestsOther = this.state.researchInterestsOther;
                    this.props.updateProfile(this.props.userName.userID, profileData);
                    break;
                };
            };
        };

    };

    /**
     * 
     * affilication 
     */
    addAffiliation(event: any) {
        let affiliations: Array<Affiliation> = this.state.affiliations;
        let newAffiliation: Array<Affiliation> = [{
            title: '',
            organization: '',
            started: '',
            ended: ''
        }];
        this.setState({ affiliations: affiliations.concat(newAffiliation) });
    };

    deleteAffiliation(index: number) {
        let arr = this.state.affiliations;
        arr.splice(index, 1);
        this.setState({ affiliations: arr });
    };

    showEditButtons() {
        if(this.props.editEnable === true) {
            return false;
        } else {
            return true;
        };
    };

    affiliationJobTitleOnChange(item: any, index: number) {
        let affiliations = this.state.affiliations;
        affiliations[index].title = item;
        this.setState({ affiliations: affiliations })
        console.log(affiliations)
    };
    affiliationStartOnChange(item: any, index: number, param: string) {
        let affiliations: Array<Affiliation> = this.state.affiliations;
        let what = param as Affiliation['started']
        affiliations[index].started = item;
        this.setState({ affiliations: affiliations })
    };
    affiliationEndOnChange(item: any, index: number) {
        let affiliations = this.state.affiliations;
        affiliations[index].ended = item;
        this.setState({ affiliations: affiliations })
    };
    affiliationOnSelect(item: any, index: number) {
        let affiliations = this.state.affiliations;
        affiliations[index].organization = item;
        this.setState({ affiliations: affiliations })
    };
    affiliationOnSave() {
        let profileData = this.props.profileData;
        profileData.affiliations = this.state.affiliations;
        console.log(profileData.affiliations)
        this.props.updateProfile(this.props.userName.userID, profileData)
    }

    /**
     * 
     * Organization 
     */
    institutionOnChange(event: any) {
        let profileData = this.props.profileData;
        if (typeof event !== 'undefined' && event !== profileData.organization) {
            profileData.organization = event;
            this.props.updateProfile(this.props.userName.userID, profileData);
        }
    }
    institutionOnSearch(event: any) {
        console.log(event)
        if (event.length > 3) {
            let arr = [];
            arr = institution.filter(item =>
                item.toLowerCase().includes(event.toLowerCase())
            )
            console.log(arr)
            if (arr.length >= 20) {
                this.setState({ institutionFiltered: ['Too many matches -- please enter more characters to narrow your results.'] })
            } else {
                console.log(arr)
                this.setState({ institutionFiltered: arr })
            }
        }
    }

    /**
     * 
     * Job Title
     */
    // handles jobtitle pulldown menu onChange 
    jobTitleOnChange(event: any) {
        if (event === "Other") {
            this.setState({ jobTitleValue: event });
        } else {
            let profileData = this.props.profileData;
            if (profileData.jobTitle !== event) {
                profileData.jobTitle = event;
                this.setState({ jobTitleOther: undefined });
                this.props.updateProfile(this.props.userName.userID, profileData);
            }
        }
    };

    jobTitleOtherOnChange(event: any) {
        // during developement, "[Object object]" managed to get into the state
        if (typeof event.target.value !== 'object' || typeof event.target.value !== 'undefined') {
            this.setState({ jobTitleOther: event.target.value })
        }
    };
    jobTitleOnSubmit(event: any) {
        let profileData = this.props.profileData;
        console.log(this.state.jobTitleOther)
        if (event === "Other") {
            this.setState({ jobTitleValue: event });
        } else if (profileData.jobTitle !== this.state.jobTitleValue || profileData.jobTitleOther !== this.state.jobTitleOther) {
            profileData.jobTitle = this.state.jobTitleValue;
            if (typeof this.state.jobTitleOther !== 'undefined') { profileData.jobTitleOther = this.state.jobTitleOther };
            this.setState({ jobTitleOther: undefined })
            this.props.updateProfile(this.props.userName.userID, profileData);
        };
    };

    // handles fundingSourcepulldown menu onChange 
    fundingSourceOnChange(event: any) {
        let profileData = this.props.profileData;
        profileData.fundingSource = event;
        this.props.updateProfile(this.props.userName.userID, profileData);
    };

    foo(boo: string) {
        let moo: FormItemProps["validateStatus"] = 'success';
        return moo
    }


    render() {
        return (
            <Row style={{ padding: 16 }}>
                <Row gutter={8}>
                    <Col span={8}>
                        <Card style={{ margin: '8px 0px', textAlign: 'center' }}>
                            <Tooltip overlayStyle={this.tooltipVisibility()} title='click to edit Avatar Options'>
                                <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={this.gravaterSrc()} />
                                {/* {gravatar} */}
                            </Tooltip>
                        </Card>
                        <Card
                            style={{ margin: '8px 0px', textAlign: 'left' }}
                            title={this.setName()} // less than 100
                        >
                            <Meta title="User ID" />
                            <Tooltip overlayStyle={this.tooltipVisibility()} title='User ID cannot be changed'>
                                {/* this might null or undefined or empty string */}
                                <Input readOnly={this.props.userName? true : false } className="clear-disabled userID" placeholder='User ID' defaultValue={this.props.userName.userID} />
                            </Tooltip>
                            <Meta title="Position" />
                            <Form>
                                <Select
                                    disabled={!this.props.editEnable}
                                    style={{ width: "100%" }}
                                    defaultValue={this.props.profileData.jobTitle}
                                    onChange={this.jobTitleOnChange}
                                >
                                    {jobTitles.map((item) => {
                                        return <Option key={item.label} value={item.value}>{item.label}</Option>
                                    })}
                                </Select>
                                <Form.Item validateStatus={this.foo('boo')}>
                                    <Input
                                        readOnly={!this.props.editEnable}
                                        style={{ minHeight: "40px" }}
                                        maxLength={maxInputLength.position}
                                        onBlur={this.jobTitleOnSubmit}
                                        onChange={this.jobTitleOtherOnChange}
                                        onPressEnter={this.jobTitleOnSubmit}
                                        hidden={this.state.jobTitleValue === 'Other' ? false : true}
                                        defaultValue={this.props.profileData.jobTitleOther}
                                        value={this.state.jobTitleOther}
                                    />
                                </Form.Item>
                            </Form>
                            <Meta title="Department" />
                            <Tooltip overlayStyle={this.tooltipVisibility()} title='must be more than 2 and less than 50 characters'>
                                <Input
                                    readOnly={!this.props.editEnable}
                                    className="clear-disabled department"
                                    maxLength={maxInputLength.department}
                                    onBlur={this.handleOnBlur}
                                    onPressEnter={this.handleOnBlur}
                                    defaultValue={this.props.profileData.department}
                                />
                            </Tooltip>
                            <Meta title="Organization" />
                            <Tooltip overlayStyle={this.tooltipVisibility()} placement="top" title={<this.institutionToolTip />}>
                                <div></div> {/* i don't know why this empty div has to be here for tooltip to showup  */}
                                <AutoComplete
                                    className="clear-disabled"
                                    style={{ width: "100%" }}
                                    disabled={!this.props.editEnable}
                                    allowClear
                                    dataSource={this.state.institutionFiltered}
                                    placeholder="Search or enter your organization."
                                    onSelect={this.institutionOnChange}
                                    onSearch={this.institutionOnSearch}
                                    filterOption={(inputValue, option) => {
                                        // return true;
                                        if (typeof option.props.children === 'string') {
                                            let item = option.props.children;
                                            return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                                        } else {
                                            return false
                                        }

                                    }}
                                    defaultValue={this.props.profileData.organization}
                                >
                                </AutoComplete>
                            </Tooltip>
                            <Meta title="Location" />
                            <AutoComplete
                                style={{ width: "100%" }}
                                disabled={!this.props.editEnable}
                                allowClear
                                placeholder="Search country."
                                onChange={this.countryCodeOnChange}
                                filterOption={(inputValue, option) => {
                                    // return true;
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
                                        <Option key={item[1]} value={item[1]}>
                                            {item[0]}
                                        </Option>
                                    )
                                }))}
                            </AutoComplete>
                            <Select
                                mode="single"
                                style={{ width: "100%" }}
                                showSearch
                                disabled={!this.props.editEnable}
                                maxTagCount={20}
                                placeholder="enter more than 3 characters"
                                showArrow={false}
                                onSearch={this.locationOnSearch}
                                optionFilterProp="children"
                                filterOption={(inputValue, option) => {
                                    // return true;
                                    if (typeof option.props.children === 'string') {
                                        let item = option.props.children;
                                        return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                                    } else {
                                        return false
                                    }

                                }}
                                defaultValue={this.props.profileData.city}
                            >
                                {this.state.locationSuggestions.map((item) => {
                                    return (
                                        <Option value={item}>
                                            {item}
                                        </Option>
                                    );
                                })}
                            </Select>
                            <Tooltip overlayStyle={this.tooltipVisibility()} title='must be less than 100 characters'>
                                <Input readOnly={!this.props.editEnable} className="clear-disabled" defaultValue={this.props.profileData.city} />
                            </Tooltip>
                            <Input className="clear-disabled" readOnly={!this.props.editEnable} defaultValue={this.props.profileData.state} />
                            <Input className='clear-disabled' type='number' readOnly={!this.props.editEnable} defaultValue={this.props.profileData.postalCode} />
                            <Meta title="Primary Funding Source" />
                            {/* <Input className="clear-disabled" disabled defaultValue={this.props.profileData.fundingSource}/> */}
                            <Select
                                mode="single"
                                style={{ width: "100%" }}
                                showSearch
                                disabled={!this.props.editEnable}
                                maxTagCount={20}
                                placeholder="enter more than 3 characters"
                                showArrow={false}
                                onChange={this.fundingSourceOnChange}
                                optionFilterProp="children"
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
                    </Col>
                    <Col span={16}>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Card className="card-with-height researchInterests" style={{ margin: '8px 0px' }} title="Research Interests">
                                    <Tooltip overlayStyle={this.tooltipVisibility()} title='Click to select research interests'>
                                    <div id="researchInterests" onClick={this.showModal.bind(this)} >
                                        <this.researchInterests />
                                    </div>
                                    </Tooltip>
                                    <Modal
                                        visible={this.state.researchInterestsModalVisible}
                                        title="Research Interests"
                                        okText="Save"
                                        closable={false}
                                        onOk={this.closeModal.bind(this)}
                                        onCancel={this.closeModal.bind(this)}
                                        footer={[
                                            <Button key="back" onClick={this.closeModal.bind(this)}>
                                                Return
                                            </Button>,
                                            <Button key="submit" id="researchInterests" type="primary" onClick={this.researchInterestOnSumbit}>
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
                                            maxLength={maxInputLength.position}
                                            onChange={this.researchInterestsOtherOnChange}
                                            hidden={this.state.researchInterestsValue.includes("Other") ? false : true}
                                            defaultValue={this.props.profileData.researchInterestsOther}
                                            value={this.state.researchInterestsOther}
                                        />
                                    </Modal>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card className="card-with-height" style={{ margin: '8px 0px' }} title="Organizations">
                                    <OrgsContainer />
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            {/* TODO:AKIYO FIX - when the box is very small it doesn't break or hide word */}
                            <Card
                                style={{ margin: '8px 0px' }}
                                title="Research or Personal Statement"
                            >
                                <Form.Item>
                                    <Tooltip overlayStyle={this.tooltipVisibility()} title='must be less than 1000 characters'>
                                        <TextArea
                                            autosize
                                            readOnly={!this.props.editEnable}
                                            maxLength={maxInputLength.researchStatement}
                                            className='clear-disabled researchStatement'
                                            onBlur={this.handleOnBlur}
                                            onPressEnter={this.handleOnBlur}
                                            defaultValue={this.props.profileData.researchStatement}
                                        />
                                    </Tooltip>
                                </Form.Item>
                            </Card>
                            <Card style={{ margin: '8px 0px' }} title="Affiliations">
                                {this.affiliations()}
                                <Button hidden={this.showEditButtons()} style={{ margin: '10px' }} key="submit" type="primary" onClick={this.affiliationOnSave.bind(this)}>
                                    save
                                    </Button>
                                <Button hidden={this.showEditButtons()}  style={{ margin: '10px' }} key="add" type="primary" onClick={this.addAffiliation.bind(this)}>
                                    add
                                    </Button>
                            </Card>
                        </Row>
                    </Col>
                </Row>
            </Row>
        );
    };
};

export default ProfileClass;
