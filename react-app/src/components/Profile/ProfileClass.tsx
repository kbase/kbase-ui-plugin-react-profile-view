import React, { CSSProperties } from 'react';
import { Row, Col, Card, Input, Tooltip, Form, Checkbox, Modal, Select, Button, Empty } from 'antd';
import { FormItemProps } from 'antd/es/form';
import { UserName, ProfileData } from '../../redux/interfaces';
import nouserpic from '../../assets/nouserpic.png';
import OrgsContainer from '../Orgs/OrgsContainer';
import { maxInputLength, researchInterestsList, jobTitles } from '../../profileConfig';

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
    afflicationModalVisible: boolean;
    jobTitleModalVisible:boolean;
    jobTitleValue:string; // value returned by onChange
    jobTitleOther:string;
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
            afflicationModalVisible: false,
            jobTitleModalVisible: false,
            jobTitleValue: '',
            jobTitleOther: ''
        };

        this.tooltipVisibility = this.tooltipVisibility.bind(this); // tooltip is visible when auth user is using the profile
        this.gravaterSrc = this.gravaterSrc.bind(this); // setting img src for gravater
        this.setName = this.setName.bind(this); // creating html element including tooltip to fit in card header 
        this.affiliations = this.affiliations.bind(this); // handles no-data or underfined data and populate data
        this.researchInterests = this.researchInterests.bind(this); // handles no-data or underfined data and populate data
        this.setJobTitle = this.setJobTitle.bind(this); // handles no-data or underfined data and populate data
        this.handleOnClick = this.handleOnClick.bind(this);
        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.researchStatementChange = this.researchStatementChange.bind(this);
        this.jobTitleOnChange = this.jobTitleOnChange.bind(this); // update/save value from pull down
        this.foo = this.foo.bind(this);
        this.researchInterestSave = this.researchInterestSave.bind(this);
        this.researchInterestOnChange = this.researchInterestOnChange.bind(this); // update/save value from checkbox group 

    }
    
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
        this.tooltipVisibility();
    }
    // if you're going ot use prevProps, prevState
    // you need to put all these three for typescript to be happy.
    componentDidUpdate(prevProps:Props, prevState: State, snapshot:any){
        console.log('componentdidUpdate', this.state)
        console.log('componentdidUpdate', prevState)
        this.tooltipVisibility();
    }
    
    /**
     * if profile is auth user's profile, then edit is enabled 
     * make tool tips visible
     */
    tooltipVisibility ():CSSProperties {
        // if (props.profileEdit) {
        //     return {visibility: 'visible'}
        // } else {visibility: 'hidden' }
        return {visibility: 'visible'};
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
        return <Tooltip title='must be less than 100 characters'><Input className="clear-disabled" maxLength={maxInputLength.name} defaultValue={this.props.userName.name}/> </Tooltip>
    }
    

    // populate afflications and handles case that afflication list prop is empty
    affiliations(){
        if(typeof this.props.profileData.affiliations !== 'undefined' && Array.isArray(this.props.profileData.affiliations)){
                return(
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
            )
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

            return (
                <ul style={{ textAlign: 'left' }}>
                    {researchInterests.map((interest) => (
                        <li key={interest}>{interest}</li>
                    ))}
                </ul>
            )

        } else {
            return (
                <div>No reasearch interest chosen.</div>
            )
        };
    }
    
    handleOnClick(event:any) {
        console.log('on click',  event.target)
        if(event.target.hasAttribute('readonly')) {
            event.target.removeAttribute('readonly');
        };
    };

    /**
     * I'll be looking forward to suggestions for better ways to do this.
     * @param event 
     */
    showModal(event:any) {
        console.log('showModal',  event.currentTarget)
        switch(event.currentTarget.id){
            case 'researchInterests':
                this.setState({researchInterestsModalVisible: true});
                break;
            case 'affiliations':
                this.setState({afflicationModalVisible: true});
                break;
            case 'jobTitle':
                this.setState({jobTitleModalVisible: true});
                break;
            default:
                break;
        }
    };

    closeModal(event:any) {
        console.log('closeModal',  event.target, event);
        switch(event.target.id){
            case 'researchInterests':
                this.setState({researchInterestsModalVisible: false});
                break;
            case 'affiliations':
                this.setState({afflicationModalVisible: false});
                break;
            case 'jobTitle':
                this.setState({jobTitleModalVisible: false});
                break;
            default:
                break;
        }
    }

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
    
    jobTitleOnChange(event:any){
        // console.log(event.target.value.length);
        this.setState({ jobTitleValue: event })
    }

    researchInterestOnChange(event:any){
        if(typeof event !== 'undefined'){
            this.setState({ researchInterestsValue: event })
        }
    }

    researchInterestSave(event:any){
        this.setState({ researchInterestsModalVisible: false })
        let profileData:any = this.props.profileData; 
        let arrState = this.state.researchInterestsValue;
        let arrProps = profileData.researchInterests;
        // it does bother me that there ae two exact same 2 lines of code....
        if( arrState.length !== arrProps.length ) {
            profileData['researchInterests'] = arrState;
            this.props.updateProfile(this.props.userName.userID, profileData);
        } else {
            for( let i=0; i < arrState.length; i++ ) {
                if( arrState[i] !== arrProps[i] ){
                    profileData['researchInterests'] = arrState;
                    this.props.updateProfile(this.props.userName.userID, profileData);
                    break;
                }
            } 
        }
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
                        {/* <pre>
                            { JSON.stringify(props.profileData, null, 2) }
                        </pre> */}
                        <Card
                            style={{ margin: '8px 0px', textAlign: 'left' }}
                            title={this.setName} // less than 100
                        >
                            <Meta title="User ID" />
                            <Tooltip overlayStyle={this.tooltipVisibility()} trigger={'click'} title='User ID cannot be changed'>
                                <Input className="clear-disabled userID" readOnly placeholder='User ID' defaultValue={this.props.userName.userID} />
                            </Tooltip>
                            <Meta title="Position" />
                            {/* job title less than 50 */}
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
                                    <Form.Item>
                                    <Button key="submit" id="jobTitle" type="primary" onClick={this.handleOnSubmit}>
                                      Submit
                                    </Button>
                                    </Form.Item>,
                                ]}
                            >
                                <Form onSubmit={this.handleOnSubmit}>
                                    <Form.Item>
                                    <Select style={{ width: "100%" }} onChange={this.jobTitleOnChange}>
                                        {jobTitles.map((item)=>{
                                            return <Option value={item.value}>{item.label}</Option>
                                        })}
                                    </Select>
                                    </Form.Item>
                                </Form>
                            </Modal>
                            <Meta title="Department" />
                            <Tooltip overlayStyle={this.tooltipVisibility()} trigger={'click'} title='must be more than 2 and less than 50 characters'>
                                <Input 
                                    className="clear-disabled department" 
                                    readOnly maxLength={maxInputLength.department} 
                                    onClick={this.handleOnClick} onBlur={this.handleOnBlur} 
                                    defaultValue={this.props.profileData.department} 
                                />
                            </Tooltip>
                            <Meta title="Organization" />
                            <Input className="clear-disabled" disabled defaultValue={this.props.profileData.organization}/>
                            <Meta title="Location" />
                            <Tooltip overlayStyle={this.tooltipVisibility()}  trigger={'click'} title='must be less than 100 characters'>
                                <Input className="clear-disabled" disabled defaultValue={this.props.profileData.city}/>
                            </Tooltip>
                            <Input className="clear-disabled" disabled defaultValue={this.props.profileData.state}/>
                            <Input className="clear-disabled" disabled defaultValue={this.props.profileData.country}/>
                            <Meta title="Primary Funding Source" />
                            <Input className="clear-disabled" disabled defaultValue={this.props.profileData.fundingSource}/>
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Card className="card-with-height researchInterests" style={{ margin: '8px 0px' }} title="Research Interests">
                                    <div id="researchInterests" onClick={this.showModal} >
                                        {/* <List
                                            // if dataSource - list of research interest is undefined, then use an empty array.
                                            dataSource={this.props.profileData.researchInterests && Array.isArray(this.props.profileData.researchInterests) ? this.props.profileData.researchInterests : []}
                                            renderItem={item => <List.Item className='profile-list'>{item}</List.Item>}
                                        /> */}
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
                                            <Button key="submit" id="researchInterests" type="primary" onClick={this.researchInterestSave}>
                                              Submit
                                            </Button>,
                                        ]}
                                    >
                                        <Checkbox.Group
                                            options={researchInterestsList}
                                            defaultValue={this.props.profileData.researchInterests}
                                            onChange={this.researchInterestOnChange}
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
                            {/* less than 1000 */}
                            <Form.Item>
                            <Tooltip overlayStyle={this.tooltipVisibility()} trigger={'click'} title='must be less than 1000 characters'>
                                <TextArea 
                                    autosize 
                                    maxLength={maxInputLength.researchStatement} 
                                    readOnly 
                                    className='clear-disabled researchStatement' 
                                    onClick={this.handleOnClick} 
                                    onBlur={this.researchStatementChange} 
                                    defaultValue={this.props.profileData.researchStatement} 
                                /> 
                                {/* <TextArea autosize maxLength={maxInputLength.researchStatement} readOnly className='clear-disabled researchStatement' onClick={handleOnClick} onBlur={researchStatementChange} value={props.profileData.researchStatement}/>  */}
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
                                    sweet
                                </Modal>
                                    
                            </Card>
                        </Row>
                    </Col>
                </Row>
            </Row>
        );
    }
}

export default ProfileClass;
