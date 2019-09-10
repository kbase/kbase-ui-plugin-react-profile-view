import React, { CSSProperties } from 'react';
import { Row, Col, Card, Input, Tooltip, Form, Checkbox, Modal, Button } from 'antd';
import { FormItemProps } from 'antd/es/form';

import { UserName, ProfileData } from '../../redux/interfaces';
import nouserpic from '../../assets/nouserpic.png';
import OrgsContainer from '../Orgs/OrgsContainer';
import { maxInputLength, researchInterestsList } from '../../profileConfig';

const { Meta } = Card;
const { TextArea } = Input;

interface Props {
    userName: UserName;
    editEnable: Boolean;
    profileData: ProfileData;
    gravatarHash: string;
    profileFetchStatus: string;
    updateProfile: (profileID: string, userdata:ProfileData) => void;
};

interface ProfileState{
    foo: string;
    profileDataKeySet: Set<string>
    researchInterestsVisible: boolean;
}
interface Woo {
    woo:FormItemProps;
}

/**
 * Returns profile component.
 * @param props
 */
class ProfileClass extends React.Component<Props, ProfileState> {
    constructor(props: Props) {
        super(props);
        this.state ={ 
            foo: 'foo',
            profileDataKeySet: new Set(),
            researchInterestsVisible: false
        };
        this.setAffiliations = this.setAffiliations.bind(this);
        this.tooltipVisibility = this.tooltipVisibility.bind(this);
        this.setAffiliations = this.setAffiliations.bind(this);
        this.gravaterSrc = this.gravaterSrc.bind(this);
        this.setJobTitle = this.setJobTitle.bind(this);
        this.setName = this.setName.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.onChangeHanlder = this.onChangeHanlder.bind(this);
        this.foo = this.foo.bind(this);

    }
    
    componentDidMount(){
        console.log('profile props', this.props)
        let profile: ProfileData;
        profile = this.props.profileData;
        
        let profileDataKeySet = new Set();
        for (let item in profile) {
            profileDataKeySet.add(item);
        };
        
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
    

    // set affiliations to an empty strings for undefined case.
    setAffiliations(){
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
                <div></div>
            )
        };
    };

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
    

    // Set jobTitle
    setJobTitle():string {
        if (this.props.profileData.jobTitle === 'Other' && typeof this.props.profileData.jobTitle !== 'undefined') {
            return this.props.profileData.jobTitleOther;
        } else if (typeof this.props.profileData.jobTitle !== 'undefined') {
            return this.props.profileData.jobTitle;
        } else {
            return '';
        };
    };
    
    handleOnClick(event:any) {
        console.log('on click',  event.target)
        event.target.stopPropagation(); // <-- not working!! 
        if(event.target.hasAttribute('readonly')) {
            event.target.removeAttribute('readonly');
        };
    };

    showModal(event:any) {
        console.log('showModal',  event.currentTarget)
        // let foo:Array<HTMLElement> = event.target.children;
        // for( let i = 0; i< foo.length; i++) {
        //     foo[i].addEventListener('click', showModal)    
        // };
        // event.stopProagation();
    
    };

    closeModal(event:any) {
        console.log('closeModal',  event.target)
    
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
    
    onChangeHanlder(event:any){
        // console.log(event.target.value.length);
        console.log(event);
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
                            title={this.setName()} // less than 100
                        >
                            <Meta title="User ID" />
                            <Tooltip overlayStyle={this.tooltipVisibility()} trigger={'click'} title='User ID cannot be changed'>
                                <Input className="clear-disabled userID" readOnly placeholder='User ID' defaultValue={this.props.userName.userID} />
                            </Tooltip>
                            <Meta title="Position" />
                            {/* job title less than 50 */}
                            <Input className="clear-disabled" maxLength={maxInputLength.position} defaultValue={this.setJobTitle()}/> 
                            <Meta title="Department" />
                            <Tooltip overlayStyle={this.tooltipVisibility()} trigger={'click'} title='must be more than 2 and less than 50 characters'>
                                <Input className="clear-disabled department" readOnly maxLength={maxInputLength.department} onClick={this.handleOnClick} onBlur={this.handleOnBlur} defaultValue={this.props.profileData.department} />
                            </Tooltip>
                            <Meta title="Organization" />
                            <Input className="clear-disabled" disabled defaultValue={this.props.profileData.organization}/>
                            <Meta title="Location" />
                            <Tooltip overlayStyle={this.tooltipVisibility()}  trigger={'click'} title='must be less than 100 characters'><Input className="clear-disabled" disabled defaultValue={this.props.profileData.city}/></Tooltip>
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
                                    <div className="popup" title="researchInterests" onClick={this.showModal} >
                                    {this.researchInterests}
                                    <Modal
                                        visible={this.state.researchInterestsVisible}
                                        title="Title"
                                        okText="Save"
                                        onOk={this.handleOnBlur}
                                        onCancel={this.closeModal}
                                    >
                                        <Checkbox.Group
                                            options={researchInterestsList}
                                            defaultValue={this.props.profileData.researchInterests}
                                            onChange={this.onChangeHanlder}
                                        />
                                    </Modal>
                                    </div>  
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
                                <TextArea autosize maxLength={maxInputLength.researchStatement} readOnly className='clear-disabled researchStatement' onClick={this.handleOnClick} onBlur={this.researchStatementChange} defaultValue={this.props.profileData.researchStatement} onChange={this.onChangeHanlder} /> 
                                {/* <TextArea autosize maxLength={maxInputLength.researchStatement} readOnly className='clear-disabled researchStatement' onClick={handleOnClick} onBlur={researchStatementChange} value={props.profileData.researchStatement}/>  */}
                            </Tooltip>
                            </Form.Item>
                            </Card>
                            <Card style={{ margin: '8px 0px' }} title="Affiliations">
                                <div className='affiliations' onClick={this.handleOnClick} onBlur={this.handleOnBlur} >
                                {/* <ul style={{ textAlign: 'left' }}>
                                    {this.setAffiliations().map((position, index) => (
                                        <li key={index}>
                                            {position.title} @ {position.organization}, {position.started} -{' '}
                                            {position.ended}{' '}
                                        </li>
                                    ))}
                                </ul> */}
                                {this.setAffiliations}
                                </div>
                            </Card>
                        </Row>
                    </Col>
                </Row>
            </Row>
        );
    }
}

export default ProfileClass;
