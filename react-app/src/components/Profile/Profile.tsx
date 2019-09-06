import React from 'react';
import { Row, Col, Card, Input} from 'antd';

import { UserName, ProfileData, ProfileView } from '../../redux/interfaces';
import nouserpic from '../../assets/nouserpic.png';
import OrgsContainer from '../Orgs/OrgsContainer';

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
interface Dictionary<T> {
    [key: string]: T;
}
/**
 * Returns profile component.
 * @param props
 */
function Profile(props: Props) {
    console.log('profile props', props)
    let profile: ProfileData
        profile = props.profileData;
    let foo = new Set();
    for (let item in profile) {
        foo.add(item);
    }
    console.log(foo)
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
        }
    }
    // set researchInterests to an empty array for undefined case - inital render.
    let researchInterests: Array<string> = [];

    // Set researchInterests to an empty array for undefined case - inital render.
    if (typeof profile.researchInterests !== 'undefined' && Array.isArray(profile.researchInterests)) {
        researchInterests = profile.researchInterests;
    }

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
    }

    // Set jobTitle
    function setJobTitle():string {
        if (profile.jobTitle === 'Other' && typeof profile.jobTitle !== 'undefined') {
            return profile.jobTitleOther;
        } else if (typeof profile.jobTitle !== 'undefined') {
            return profile.jobTitle;
        } else {
            return '';
        }
    }
    
    function handleOnClick(event:any) {
        // console.log('on clicke',  event.target, event.target.value)
        event.stopPropagation(); // <-- not working!! 
        if(event.target.hasAttribute('readonly')) {
            event.target.removeAttribute('readonly');
        };
    }
    function handleOnBlur(event:any) {
        console.log('handleOnBlur',  event.target)
        event.stopPropagation();
        let profileData:any = props.profileData;
        for( let i = 0; i < event.target.classList.length; i++ ){
            if (foo.has(event.target.classList[i])){
                profileData[event.target.classList[i]] = event.target.value;
            }
        }
        props.updateProfile(props.userName.userID, profileData)
    }
        
        
        // i don't think I need this either...
        // event.target.setAttribute('readonly', 'readonly');
        // props.updateProfile(props.userName.userID, profileData);
    
     return (
        <Row style={{ padding: 16 }}>
            <Row gutter={8}>
                <Col span={8}>
                    <Card style={{ margin: '8px 0px', textAlign: 'center' }}>
                        <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={ gravaterSrc() } />
                        {/* {gravatar} */}
                    </Card>
                    {/* <pre>
                        { JSON.stringify(props.profileData, null, 2) }
                    </pre> */}
                    <Card
                        style={{ margin: '8px 0px', textAlign: 'left' }}
                        title={props.userName.name}
                    >
                        <Meta title="User ID" />
                        <Input className="clear-disabled userID" readOnly defaultValue={props.userName.userID} />
                        <Meta title="Position" />
                        <Input className="clear-disabled" defaultValue={setJobTitle()}/>
                        <Meta title="Department" />
                        <Input className="clear-disabled department" readOnly onClick={handleOnClick} onBlur={handleOnBlur} defaultValue={profile.department} />
                        <Meta title="Organization" />
                        <Input className="clear-disabled" disabled defaultValue={profile.organization}/>
                        <Meta title="Location" />
                        <Input className="clear-disabled" disabled defaultValue={profile.city}/>
                        <Input className="clear-disabled" disabled defaultValue={profile.state}/>
                        <Input className="clear-disabled" disabled defaultValue={profile.country}/>
                        <Meta title="Primary Funding Source" />
                        <Input className="clear-disabled" disabled defaultValue={profile.fundingSource}/>
                    </Card>
                </Col>
                <Col span={16}>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Card className="card-with-height researchInterests" onClick={handleOnClick} style={{ margin: '8px 0px' }} title="Research Interests">
                                <ul style={{ textAlign: 'left' }}>
                                    {researchInterests.map((interest) => (
                                        <li key={interest}>{interest}</li>
                                    ))}
                                </ul>
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
                            <TextArea autosize readOnly className='clear-disabled researchStatement' onClick={handleOnClick} onBlur={handleOnBlur} defaultValue={props.profileData.researchStatement}/>
                        </Card>
                        <Card style={{ margin: '8px 0px' }} title="Afflications">
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
} 

export default Profile;
