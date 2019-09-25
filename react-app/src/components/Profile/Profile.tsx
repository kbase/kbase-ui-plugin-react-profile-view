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
    editEnable: boolean;
    profileData: ProfileData;
    gravatarHash: string;
    profileFetchStatus: string;
    updateProfile: (profileID: string, userdata:ProfileData) => void;
};
interface Woo {
    woo:FormItemProps;
}

/**
 * Returns profile component.
 * @param props
 */
function Profile(props: Props) {

    console.log('profile props', props)
    let profile: ProfileData;
        profile = props.profileData;

    let profileDataKeySet = new Set();
    for (let item in profile) {
        profileDataKeySet.add(item);
    };
    
    
    function tooltipVisibility ():CSSProperties {
        // if (props.profileEdit) {
        //     return {visibility: 'visible'}
        // } else {visibility: 'hidden' }
        return {visibility: 'visible'};
    }

    // console.log(profileDataKeySet);
    // Set initial value for properties that are arrays. 
    // Otherwise .map will complain during initial render. 

    // set affiliations to an empty strings for undefined case.
    function setAffiliations(){
        if(typeof profile.affiliations !== 'undefined' && Array.isArray(profile.affiliations)){
            return profile.affiliations;
        } else {
            return [
                {
                    title: '',
                    organization: '',
                    started: '',
                    ended: ''
                }
            ];
        };
    };
    // set researchInterests to an empty array for undefined case - inital render.
    let researchInterests: Array<string> = [];

    // Set researchInterests to an empty array for undefined case - inital render.
    if (typeof profile.researchInterests !== 'undefined' && Array.isArray(profile.researchInterests)) {
        researchInterests = profile.researchInterests;
    };

    // Set gravatarURL
    function gravaterSrc(){
        if (profile['avatarOption'] === 'silhoutte' || !props.gravatarHash) {
            // let gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt="avatar" src={nouserpic} />;
            return nouserpic
        } else if (props.gravatarHash) {
            return 'https://www.gravatar.com/avatar/' + props.gravatarHash + '?s=300&amp;r=pg&d=' + profile.gravatarDefault;
            // let gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt="avatar" src={gravaterSrc} />;
        }
        return 'https://www.gravatar.com/avatar/' + props.gravatarHash + '?s=300&amp;r=pg&d=' + profile.gravatarDefault;
    };

    // Set jobTitle
    function setJobTitle():string {
        if (profile.jobTitle === 'Other' && typeof profile.jobTitle !== 'undefined') {
            return profile.jobTitleOther;
        } else if (typeof profile.jobTitle !== 'undefined') {
            return profile.jobTitle;
        } else {
            return '';
        };
    };
    
    // Set name and tooltip 
    function setName(){
        return <Tooltip title='must be less than 100 characters'><Input className="clear-disabled" maxLength={maxInputLength.name} defaultValue={props.userName.name}/> </Tooltip>
    }

    function handleOnClick(event:any) {
        console.log('on click',  event.target)
        event.target.stopPropagation(); // <-- not working!! 
        if(event.target.hasAttribute('readonly')) {
            event.target.removeAttribute('readonly');
        };
    };
    // function showModal(event:any) {
    //     console.log('showModal',  event.currentTarget)
    //     // let foo:Array<HTMLElement> = event.target.children;
    //     // for( let i = 0; i< foo.length; i++) {
    //     //     foo[i].addEventListener('click', showModal)    
    //     // };
    //     // event.stopProagation();

    // };
    function closeModal(event:any) {
        console.log('closeModal',  event.target)

    }

    function handleOnBlur(event:any) {
        console.log('handleOnBlur',  event.target)
        let elem = event.target;
        let profileData:any = props.profileData;
        for( let i = 0; i < elem.classList.length; i++ ){
            let targetClass = elem.classList[i];
            if ( profileDataKeySet.has(targetClass) && profileData[targetClass] !== elem.value ){
                profileData[targetClass] = elem.value.trim();
                props.updateProfile(props.userName.userID, profileData);
            };
        };
    };

    /**
     * onBlur event handler for reseachStatement
     * if the event targat value is not the same as the prop value, 
     * then update / make sure to trim it! 
     * @param event 
     */
    function researchStatementChange(event:any) {
        console.log('researchStatement',  event.target)
        // need to check if it's really the right element has(class)
        // trim value
        // check if it's the same as before. don't re-render when you don't need to
        let elem = event.target;

        // haven't figure out how to make it work without using 'any' type.
        let profileData:any = props.profileData; 
        for( let i = 0; i < elem.classList.length; i++ ){
            let targetClass = elem.classList[i];
            if ( profileDataKeySet.has(targetClass) && profileData[targetClass] !== elem.value ){
                profileData[targetClass] = elem.value.trim();
                props.updateProfile(props.userName.userID, profileData);
            };
        };
    };
    
    function onChangeHanlder(event:any){
        // console.log(event.target.value.length);
        console.log(event);
    }

    function foo(boo:string) {
        let moo:FormItemProps["validateStatus"] = 'success';
        return moo
    }
     return (
        <Row style={{ padding: 16 }}>
            <Row gutter={8}>
                <Col span={8}>
                    <Card style={{ margin: '8px 0px', textAlign: 'center' }}>
                        <Tooltip  overlayStyle={tooltipVisibility()} title='click to edit Avatar Options'>
                            <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={ gravaterSrc() } />
                            {/* {gravatar} */}
                        </Tooltip>
                    </Card>
                    {/* <pre>
                        { JSON.stringify(props.profileData, null, 2) }
                    </pre> */}
                    <Card
                        style={{ margin: '8px 0px', textAlign: 'left' }}
                        // title={props.userName.name} // less than 100
                        title={setName()} // less than 100
                    >
                        <Meta title="User ID" />
                        <Tooltip overlayStyle={tooltipVisibility()} trigger={'click'} title='User ID cannot be changed'>
                            <Input className="clear-disabled userID" readOnly placeholder='User ID' defaultValue={props.userName.userID} />
                        </Tooltip>
                        <Meta title="Position" />
                        {/* job title less than 50 */}
                        <Input className="clear-disabled" maxLength={maxInputLength.position} defaultValue={setJobTitle()}/> 
                        <Meta title="Department" />
                        <Tooltip overlayStyle={tooltipVisibility()} trigger={'click'} title='must be more than 2 and less than 50 characters'>
                            <Input className="clear-disabled department" readOnly maxLength={maxInputLength.department} onClick={handleOnClick} onBlur={handleOnBlur} defaultValue={profile.department} />
                        </Tooltip>
                        <Meta title="Organization" />
                        <Input className="clear-disabled" disabled defaultValue={profile.organization}/>
                        <Meta title="Location" />
                        <Tooltip overlayStyle={tooltipVisibility()}  trigger={'click'} title='must be less than 100 characters'><Input className="clear-disabled" disabled defaultValue={profile.city}/></Tooltip>
                        <Input className="clear-disabled" disabled defaultValue={profile.state}/>
                        <Input className="clear-disabled" disabled defaultValue={profile.country}/>
                        <Meta title="Primary Funding Source" />
                        <Input className="clear-disabled" disabled defaultValue={profile.fundingSource}/>
                    </Card>
                </Col>
                <Col span={16}>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Card className="card-with-height researchInterests" style={{ margin: '8px 0px' }} title="Research Interests">
                                <div className="popup" title="researchInterests"  >
                                <ul style={{ textAlign: 'left' }}>
                                    {researchInterests.map((interest) => (
                                        <li key={interest}>{interest}</li>
                                    ))}
                                </ul>
                                <Modal
                                    // visible={visible}
                                    title="Title"
                                    okText="Save"
                                    onOk={handleOnBlur}
                                    onCancel={closeModal}
                                >
                                    {/* <Checkbox.Group
                                        options={researchInterestsList}
                                        defaultValue={researchInterests}
                                        onChange={onChangeHanlder}
                                    /> */}
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
                        <Tooltip overlayStyle={tooltipVisibility()} trigger={'click'} title='must be less than 1000 characters'>
                            <TextArea autosize maxLength={maxInputLength.researchStatement} readOnly className='clear-disabled researchStatement' onClick={handleOnClick} onBlur={researchStatementChange} defaultValue={props.profileData.researchStatement} onChange={onChangeHanlder} /> 
                            {/* <TextArea autosize maxLength={maxInputLength.researchStatement} readOnly className='clear-disabled researchStatement' onClick={handleOnClick} onBlur={researchStatementChange} value={props.profileData.researchStatement}/>  */}
                        </Tooltip>
                        </Form.Item>
                        </Card>
                        <Card style={{ margin: '8px 0px' }} title="Affiliations">
                            <div className='affiliations' onClick={handleOnClick} onBlur={handleOnBlur} >
                            <ul style={{ textAlign: 'left' }}>
                                {setAffiliations().map((position, index) => (
                                    <li key={index}>
                                        {position.title} @ {position.organization}, {position.started} -{' '}
                                        {position.ended}{' '}
                                    </li>
                                ))}
                            </ul>
                            </div>
                        </Card>
                    </Row>
                </Col>
            </Row>
        </Row>
    );
};

export default Profile;
