import React, { CSSProperties } from 'react';
import { Row, Col, Card, Input, Tooltip, Form, Checkbox, Modal, Select, Button, Empty } from 'antd';
import { FormItemProps } from 'antd/es/form';
import { UserName, ProfileData } from '../../redux/interfaces';
import nouserpic from '../../assets/nouserpic.png';
import OrgsContainer from '../Orgs/OrgsContainer';
import { maxInputLength, researchInterestsList, jobTitles } from '../../profileConfig';
import { fundingSources, countryCodes, institution } from '../../dataSources';

const { Meta } = Card;
const { TextArea } = Input;
const { Option } = Select;


interface Props {
    userName: UserName;
    editEnable: Boolean;
    profileData: ProfileData;
    gravatarHash: string;
    profileFetchStatus: string;
    updateProfile: (profileID: string, userdata:ProfileData) => void;
};

interface State{
    foo: string;
    profileDataKeySet: Set<string>
    researchInterestsModalVisible: boolean;
    researchInterestsValue: Array<string>; // value returned by onChange
    researchInterestsOther: string;
    afflicationModalVisible: boolean;
    jobTitleModalVisible: boolean;
    jobTitleValue: string; // value returned by onChange
    jobTitleOther: string;
    organizationModalVisible: boolean;
    fundingSourceValue: string; // value returned from pulldown
    locationSuggestions: Array<string>;
    countryCode: string;
    institutionFiltered: Array<string>;
}
interface Woo {
    woo:FormItemProps;
}

/**
 * Returns profile component.
 * @param props
 */
class ProfileClass extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state ={ 
            foo: 'foo',
            profileDataKeySet: new Set(),
            researchInterestsModalVisible: false,
            researchInterestsValue: [],
            researchInterestsOther: '',
            afflicationModalVisible: false,
            jobTitleModalVisible: false,
            jobTitleValue: '',
            jobTitleOther: '',
            organizationModalVisible: false,
            fundingSourceValue: '',
            locationSuggestions: [],
            countryCode: '',
            institutionFiltered: []
        };

        this.tooltipVisibility = this.tooltipVisibility.bind(this); // tooltip is visible when auth user is using the profile
        this.gravaterSrc = this.gravaterSrc.bind(this); // setting img src for gravater
        this.setName = this.setName.bind(this); // creating html element including tooltip to fit in card header 
        this.affiliations = this.affiliations.bind(this); // handles no-data or underfined data and populate data
        this.researchInterests = this.researchInterests.bind(this); // handles no-data or underfined data and populate data
        this.setJobTitle = this.setJobTitle.bind(this); // handles no-data or underfined data and populate data
        this.institutionToolTip = this.institutionToolTip.bind(this);
        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.researchStatementChange = this.researchStatementChange.bind(this);
        this.jobTitleOnChange = this.jobTitleOnChange.bind(this); // update/save value from pull down
        this.jobTitleOtherOnChange = this.jobTitleOtherOnChange.bind(this); // update/save value from input field 
        this.jobTitleSubmit = this.jobTitleSubmit.bind(this) // handles on sumbit job titles
        this.foo = this.foo.bind(this);
        this.researchInterestOnSumbit = this.researchInterestOnSumbit.bind(this);
        this.researchInterestsOtherOnChange = this.researchInterestsOtherOnChange.bind(this);
        this.researchInterestOnChange = this.researchInterestOnChange.bind(this); // update/save value from checkbox group 
        this.locationOnSearch = this.locationOnSearch.bind(this)
        this.fundingSourceOnChange = this.fundingSourceOnChange.bind(this);
        this.countryCodeOnChange = this.countryCodeOnChange.bind(this);
        this.institutionOnChange = this.institutionOnChange.bind(this);
        this.institutionOnSearch = this.institutionOnSearch.bind(this);
        this.setReadOnly = this.setReadOnly.bind(this);
    };
    
    componentDidMount(){
        console.log('profile props', this.props)
        let profile: ProfileData;
        profile = this.props.profileData;
        
        let newDataKeySet:Set<string> = new Set();
        for (let item in profile) {
            newDataKeySet.add(item);
        };
        this.setState({ profileDataKeySet:  newDataKeySet })
        if(typeof profile.researchInterests !== 'undefined' && 
                Array.isArray(profile.researchInterests)){
            this.setState({ researchInterestsValue: profile.researchInterests})
        }
        if( profile.jobTitle === 'Other'){
            this.setState({jobTitleValue: "Other"}) // by setting the state, showing input for job title other
        }
        this.tooltipVisibility();

    };
    // if you're going ot use prevProps, prevState
    // you need to put all these three for typescript to be happy.
    componentDidUpdate(prevProps:Props, prevState: State, snapshot:any){
        console.log('componenetupdate')
        this.tooltipVisibility();
    };
    
    /**
     * if profile is auth user's profile, then edit is enabled, then make tool tips visible
     */
    tooltipVisibility ():CSSProperties {
        // if (props.profileEdit) {
        //     return {visibility: 'visible'}
        // } else {visibility: 'hidden' }
        return {visibility: 'visible'};
    };
    // also need function to disable readonly on everything 
    setReadOnly(){
        // if (props.profileEdit) {
            //     return true
            // } else false
            return false;
    }

    // Set gravatarURL
    gravaterSrc(){
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
    setName(){
        return <Tooltip title='must be less than 100 characters'><Input className="clear-disabled" readOnly={this.setReadOnly()} maxLength={maxInputLength.name} onBlur={this.handleOnBlur} onPressEnter={this.handleOnBlur} defaultValue={this.props.userName.name}/> </Tooltip>
    };

    // populate afflications and handles case that afflication list prop is empty
    affiliations(){
        if(typeof this.props.profileData.affiliations !== 'undefined' && Array.isArray(this.props.profileData.affiliations)){
                return (
                    <ul style={{ textAlign: 'left' }}>
                        {this.props.profileData.affiliations.map((position, index) => (
                            <li key={index}>
                                {position.title} @ {position.organization}, {position.started} -{' '}
                                {position.ended}{' '}
                            </li>
                        ))}
                    </ul>
                )
        } else {
            return (
                <div><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
            );
        };
    };


    // populate jobTitle
    setJobTitle():string {
        if (this.props.profileData.jobTitle === 'Other' && typeof this.props.profileData.jobTitle !== 'undefined') {
            return this.props.profileData.jobTitleOther;
        } else if (typeof this.props.profileData.jobTitle !== 'undefined') {
            return this.props.profileData.jobTitle;
        } else {
            return '';
        };
    };
    
    // populate research interest and handles case that prop is empty
    researchInterests() {
        let researchInterests: Array<string> = [];
        if (typeof this.props.profileData.researchInterests !== 'undefined' && Array.isArray(this.props.profileData.researchInterests)) {
            researchInterests = this.props.profileData.researchInterests;
            // fun fact: node.appendChile(childNode) cannot be used with JSX Elements
                if( researchInterests.includes("Other")){
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
    
    /**
     * event handlers
     *
     * 
     * 
     * 
     */

    institutionOnSearch(event:any){
        console.log(event)
        if(event.length > 3){
            let arr=[];
            arr = institution.filter(item =>
                item.toLowerCase().includes(event.toLowerCase())
            )
            console.log(arr)
            if(arr.length >= 20) {
                this.setState({institutionFiltered: ['Too many matches -- please enter more characters to narrow your results.']})
            } else {
                console.log(arr)
                this.setState({institutionFiltered: arr})
            }
        }
    }

    async locationOnSearch(value:string){
        if (value.length > 3) {
            let suggestionsArr =[];
            let url = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json?app_id=OsLgmo5czpVQ8Ofqvn7M&app_code=KR4vdU7nGqr_PRriINGH9Q&query=';
            let fetchURL = url + value + "&=" + this.state.countryCode;
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
            for(let i = 0; i < suggestionsArr.length; i++){
                arr.push(suggestionsArr[i].label)
            } 
            this.setState({ locationSuggestions: arr })
        }

    }


    /**
     * is it better to have 5 different functions just to open modal?
     * @param event 
     */
    showModal(event:any) {
        console.log('showModal',  event.currentTarget)
        switch(event.currentTarget.id){
            case 'researchInterests':
                this.setState({ researchInterestsModalVisible: true });
                break;
            case 'affiliations':
                this.setState({ afflicationModalVisible: true });
                break;
            case 'jobTitle':
                this.setState({ jobTitleModalVisible: true });
                break;
            case 'organization':
                this.setState({ organizationModalVisible: true });
                break;
            default:
                break;
        };
    };

    closeModal(event:any) {
        console.log('closeModal',  event.target, event);
        switch(event.target.id){
            case 'researchInterests':
                this.setState({ researchInterestsModalVisible: false });
                break;
            case 'affiliations':
                this.setState({ afflicationModalVisible: false });
                break;
            case 'jobTitle':
                this.setState({ jobTitleModalVisible: false });
                break;
            case 'organization':
                this.setState({ organizationModalVisible: false });
                break;
            default:
                break;
        }
    };



    handleOnSubmit(event:any) {
        event.preventDefault();
        console.log('handleOnSubmit',  event.target, event);
        switch(event.target.id){
            case 'researchInterests':
                this.setState({researchInterestsModalVisible: false});
                if(this.state.researchInterestsValue === this.props.profileData.researchInterests){
                    console.log('this need to be updated')
                } else {
                    console.log('keep the same thing')
                }
                break;
            case 'affiliations':
                this.setState({afflicationModalVisible: false});
                break;
            case 'jobTitle':
                this.setState({jobTitleModalVisible: false});
                if(this.state.jobTitleValue === this.props.profileData.jobTitle){
                    console.log('this need to be updated')
                } else {
                    console.log('keep the same thing')
                }
                break;
            default:
                break;
        }
    }
    
    
   
////////////////////text input on change////////////////////

    // I wonder if I can put these together later with switch case
    researchInterestsOtherOnChange(event:any){
        // during developement, "[Object object]" managed to get into the state
        if(typeof event.target.value !== 'object' || typeof event.target.value !== 'undefined'){
            this.setState({ researchInterestsOther: event.target.value})
        }
    }
    jobTitleOtherOnChange(event:any){
        // during developement, "[Object object]" managed to get into the state
        if(typeof event.target.value !== 'object' || typeof event.target.value !== 'undefined'){
            this.setState({ jobTitleOther: event.target.value })
        }
    };

    /////////////////////////////////on change //////////////////


    handleOnBlur(event:any) {
        console.log('handleOnBlur',  event.target)
        let elem = event.target;
        let profileData:any = this.props.profileData;
        for( let i = 0; i < elem.classList.length; i++ ){
            let targetClass = elem.classList[i];
            if ( this.state.profileDataKeySet.has(targetClass) && profileData[targetClass] !== elem.value ){
                profileData[targetClass] = elem.value.trim();
                this.props.updateProfile(this.props.userName.userID, profileData);
            };
        };
    };

    /**
     * onBlur event handler for reseachStatement
     * if the event targat value is not the same as the prop value, 
     * then update / make sure to trim it! 
     * @param event 
     */
    researchStatementChange(event:any) {
        console.log('researchStatement',  event.target)
        // need to check if it's really the right element has(class)
        // trim value
        // check if it's the same as before. don't re-render when you don't need to
        let elem = event.target;

        // haven't figure out how to make it work without using 'any' type.
        let profileData:any = this.props.profileData; 
        for( let i = 0; i < elem.classList.length; i++ ){
            let targetClass = elem.classList[i];
            if ( this.state.profileDataKeySet.has(targetClass) && profileData[targetClass] !== elem.value ){
                profileData[targetClass] = elem.value.trim();
                this.props.updateProfile(this.props.userName.userID, profileData);
            };
        };
    };

    // handles researchInterest check box onChange 
    researchInterestOnChange(event:any){
        this.setState({ researchInterestsValue: event});
    };

    // handles jobtitle pulldown menu onChange 
    jobTitleOnChange(event:any){
        // when "Other" is un-picked, then jobTitleOther should be cleared
        if(event !== "Other"){
            this.setState({ jobTitleValue: event, jobTitleOther: ''});
        } else {
            this.setState({ jobTitleValue: event });
        }
    };
    // handles fundingSourcepulldown menu onChange 
    fundingSourceOnChange(event:any){
        let profileData = this.props.profileData;
        profileData.fundingSource = event;
        this.props.updateProfile(this.props.userName.userID, profileData);
    };

    // handles country code pull down menu
    countryCodeOnChange(event: any) {
        if(typeof event !== 'undefined'){
            this.setState({ countryCode: event });
        };
    };

    //
    institutionOnChange(event:any) {
        let profileData = this.props.profileData;
        if(typeof event !== 'undefined' && event !== profileData.organization) {
            profileData.organization = event;
            this.props.updateProfile(this.props.userName.userID, profileData);
        }
    }
    /**
     * 
     * OnSubmit Hanlders 
     */
    // handles researchInterest onSubmit 
    researchInterestOnSumbit(event:any){
        this.setState({ researchInterestsModalVisible: false }) // close modal
        let profileData:any = this.props.profileData; 
        let arrState = this.state.researchInterestsValue;
        let arrProps = profileData.researchInterests;

        // check if researchInterestOther needs to be in the profileData
        if ( arrState.includes('Other') ) {
            profileData.researchInterestsOther = this.state.researchInterestsOther;
        } else if ( !arrState.includes('Other') ) {
            // if "other" is not included then clear the state
            
            this.setState({ researchInterestsOther: '' })
        };
        
        if ( arrState.length !== arrProps.length ) {
            profileData.researchInterests = arrState;
            this.props.updateProfile(this.props.userName.userID, profileData);
        } else {
            for( let i=0; i < arrState.length; i++ ) {
                if( arrState[i] !== arrProps[i] ){
                    profileData.researchInterests = arrState;
                    profileData.researchInterestsOther = this.state.researchInterestsOther;
                    this.props.updateProfile(this.props.userName.userID, profileData);
                    break;
                };
            };
        };

    };
    

    jobTitleSubmit(event:any){
        let profileData = this.props.profileData;
        this.setState({ jobTitleModalVisible: false });// close modal
        if(profileData.jobTitle !== this.state.jobTitleValue || profileData.jobTitleOther !== this.state.jobTitleOther){
            profileData.jobTitle = this.state.jobTitleValue;
            profileData.jobTitleOther = this.state.jobTitleOther;
            this.props.updateProfile(this.props.userName.userID, profileData);
        };
    };

    institutionToolTip(){
        return(
            <div>
                <p>Your primary association - organization, institution, business.<br />
                You may enter your own value or chose from the option fileted by your entry.<br />
                National Labs derived from: <a href="https://science.energy.gov/laboratories/" target="_blank">DOE Web Site - Laboratories</a><br />
                US higher education institutions derived from: <a href="http://carnegieclassifications.iu.edu/index.php" target="_blank">Carnegie Classification of Institutions of Higher Education </a>
                </p>
            </div>
        )
    }
    
    foo(boo:string) {
        let moo:FormItemProps["validateStatus"] = 'success';
        return moo
    }
    

    render() {
        return (
            <Row style={{ padding: 16 }}>
                <Row gutter={8}>
                    <Col span={8}>
                        <Card style={{ margin: '8px 0px', textAlign: 'center' }}>
                            <Tooltip  overlayStyle={this.tooltipVisibility()} title='click to edit Avatar Options'>
                                <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={ this.gravaterSrc() } />
                                {/* {gravatar} */}
                            </Tooltip>
                        </Card>
                        <Card
                            style={{ margin: '8px 0px', textAlign: 'left' }}
                            title={this.setName()} // less than 100
                        >
                            <Meta title="User ID" />
                            <Tooltip overlayStyle={this.tooltipVisibility()} trigger={'click'} title='User ID cannot be changed'>
                                <Input className="clear-disabled userID" readOnly placeholder='User ID' defaultValue={this.props.userName.userID} />
                            </Tooltip>
                            <Meta title="Position" />
                            <div id="jobTitle" onClick={this.showModal} >
                                <Input className="clear-disabled" maxLength={maxInputLength.position} defaultValue={this.setJobTitle()}/> 
                            </div>
                            <Modal
                                visible={this.state.jobTitleModalVisible}
                                title="Job Title"
                                okText="Save"
                                onOk={this.closeModal}
                                onCancel={this.closeModal}
                                closable = {false}
                                footer={[
                                    // make sure button id match with the id for onclick={this.showModal}
                                    <Button key="back" id="jobTitle" onClick={this.closeModal}>
                                      Return
                                    </Button>,
                                    <Button key="submit" id="jobTitle" type="primary" onClick={this.jobTitleSubmit}>
                                      Submit
                                    </Button>
                                ]}
                            >
                                <Form>
                                    <Form.Item>
                                    <Select 
                                        style={{ width: "100%" }} 
                                        defaultValue={this.props.profileData.jobTitle} 
                                        onChange={this.jobTitleOnChange}
                                    >
                                        {jobTitles.map((item)=>{
                                            return <Option value={item.value}>{item.label}</Option>
                                        })}
                                    </Select>
                                    </Form.Item>
                                    <Form.Item  validateStatus={this.foo('boo')}>
                                    <Input 
                                        maxLength={maxInputLength.position}
                                        onChange={this.jobTitleOtherOnChange}
                                        hidden={ this.state.jobTitleValue === 'Other'  ?  false : true }
                                        defaultValue={this.props.profileData.jobTitleOther}
                                    />
                                    </Form.Item>
                                </Form>
                            </Modal>
                            <Meta title="Department" />
                            <Tooltip overlayStyle={this.tooltipVisibility()} trigger={'click'} title='must be more than 2 and less than 50 characters'>
                                <Input 
                                    className="clear-disabled department"
                                    readOnly={this.setReadOnly()} 
                                    maxLength={maxInputLength.department} 
                                    onBlur={this.handleOnBlur}
                                    onPressEnter={this.handleOnBlur}
                                    defaultValue={this.props.profileData.department} 
                                />
                            </Tooltip>
                            <Meta title="Organization" />
                            <Tooltip   placement="top" overlayStyle={this.tooltipVisibility()} trigger={'click'} title={<this.institutionToolTip />}>
                                <div></div> {/* i don't know why this empty div has to be here for tooltip to showup  */}
                                <Select
                                    mode="single"
                                    style={{ width: "100%" }}
                                    showSearch
                                    maxTagCount={20}
                                    placeholder="enter more than 2 characters"
                                    showArrow={false}
                                    onChange={this.institutionOnChange}
                                    onSearch={this.institutionOnSearch}
                                    optionFilterProp="children"
                                    filterOption={(inputValue, option) => {
                                        // return true;
                                        if( typeof option.props.children === 'string' ){
                                            let foo = option.props.children;
                                            return foo.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                                        } else {
                                            return false
                                        }

                                    }}
                                    defaultValue={this.props.profileData.organization}
                                >
                                    {this.state.institutionFiltered.map((item) => {
                                        return (
                                            <Option value={item}>
                                                {item}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Tooltip>
                            <Meta title="Location" />
                            <Select
                                mode="single"
                                style={{ width: "100%" }}
                                showSearch
                                maxTagCount={20}
                                placeholder="enter more than 3 characters"
                                showArrow={false}
                                // onSearch={this.locationOnSearch}
                                onChange={this.countryCodeOnChange}
                                optionFilterProp="children"
                                filterOption={(inputValue, option) => {
                                    // return true;
                                    if( typeof option.props.children === 'string' ){
                                        let foo = option.props.children;
                                        return foo.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                                    } else {
                                        return false
                                    }

                                }}
                                defaultValue={this.props.profileData.country}
                            >
                                { Array.from(countryCodes).map((item => {
                                    return(
                                        <Option value={item[1]}>
                                            {item[0]}
                                        </Option>
                                    )
                                }))}
                            </Select>    
                            <Select
                                mode="single"
                                style={{ width: "100%" }}
                                showSearch
                                maxTagCount={20}
                                placeholder="enter more than 3 characters"
                                showArrow={false}
                                onSearch={this.locationOnSearch}
                                // onChange={this.fundingSourceOnChange}
                                optionFilterProp="children"
                                filterOption={(inputValue, option) => {
                                    // return true;
                                    if( typeof option.props.children === 'string' ){
                                        let foo = option.props.children;
                                        return foo.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
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
                            <Tooltip overlayStyle={this.tooltipVisibility()}  trigger={'click'} title='must be less than 100 characters'>
                                <Input readOnly={this.setReadOnly()} className="clear-disabled" disabled defaultValue={this.props.profileData.city}/>
                            </Tooltip>
                            <Input className="clear-disabled" readOnly={this.setReadOnly()} defaultValue={this.props.profileData.state}/>
                            <Meta title="Primary Funding Source" />
                            {/* <Input className="clear-disabled" disabled defaultValue={this.props.profileData.fundingSource}/> */}
                            <Select
                                mode="single"
                                style={{ width: "100%" }}
                                showSearch
                                maxTagCount={20}
                                placeholder="enter more than 3 characters"
                                showArrow={false}
                                onChange={this.fundingSourceOnChange}
                                optionFilterProp="children"
                                filterOption={(inputValue, option) => {
                                    // return true;
                                    if( typeof option.props.children === 'string' ){
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
                                        <Option value={item['value']}>
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
                                    <div id="researchInterests" onClick={this.showModal} >
                                        <this.researchInterests />
                                    </div>  
                                    <Modal
                                        visible={this.state.researchInterestsModalVisible}
                                        title="Research Interests"
                                        okText="Save"
                                        closable = {false}
                                        onOk={this.closeModal}
                                        onCancel={this.closeModal}
                                        footer={[
                                            // make sure button id match with the id for onclick={this.showModal}
                                            <Button key="back"id="researchInterests" onClick={this.closeModal}>
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
                                            hidden={ this.state.researchInterestsValue.includes("Other")  ?  false : true }
                                            defaultValue={this.props.profileData.researchInterestsOther}
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
                            <Tooltip overlayStyle={this.tooltipVisibility()} trigger={'click'} title='must be less than 1000 characters'>
                                <TextArea 
                                    autosize
                                    readOnly={this.setReadOnly()}
                                    maxLength={maxInputLength.researchStatement} 
                                    className='clear-disabled researchStatement' 
                                    onBlur={this.researchStatementChange}
                                    onPressEnter={this.researchStatementChange}
                                    defaultValue={this.props.profileData.researchStatement} 
                                /> 
                            </Tooltip>
                            </Form.Item>
                            </Card>
                            <Card style={{ margin: '8px 0px' }} title="Affiliations">
                                <div id='affiliations' onClick={this.showModal} onBlur={this.handleOnBlur} >
                                    <this.affiliations />
                                </div>
                                <Modal
                                    visible={this.state.afflicationModalVisible}
                                    title="Research Interests"
                                    okText="Save"
                                    closable = {false}
                                    onOk={this.closeModal}
                                    onCancel={this.closeModal}
                                    footer={[
                                        // make sure button id match with the id for onclick={this.showModal}
                                        <Button key="back" id="affiliations" onClick={this.closeModal}>
                                          Return
                                        </Button>,
                                        <Button key="submit" id="affiliations" type="primary" onClick={this.closeModal}>
                                          Submit
                                        </Button>,
                                    ]}
                                >
                                    <Select
                                        mode="single"
                                        style={{ width: "100%" }}
                                        showSearch
                                        maxTagCount={20}
                                        placeholder="enter more than 3 characters"
                                        showArrow={false}
                                        onChange={this.fundingSourceOnChange}
                                        optionFilterProp="children"
                                        filterOption={(inputValue, option) => {
                                            // return true;
                                            if( typeof option.props.children === 'string' ){
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
                                                <Option value={item['value']}>
                                                    {item['value']}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </Modal>
                                    
                            </Card>
                        </Row>
                    </Col>
                </Row>
            </Row>
        );
    };
};

export default ProfileClass;
