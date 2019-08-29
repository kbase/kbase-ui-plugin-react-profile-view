import React from 'react';
import { UserName, ProfileData, OrgProp } from '../../redux/interfaces';
import { Row, Col, Card, Input, Spin } from 'antd';
import nouserpic from '../../assets/nouserpic.png';
import OrgsContainer from '../Orgs/OrgsContainer';
const { Meta } = Card;
const { TextArea } = Input;

interface Props {
    baseURL: string;
    token: string;
    userName: UserName;
    editEnable: Boolean;
    profileData: ProfileData;
    gravatarHash: string;
    profileloaded: Boolean;
}


/**
 * Returns profile component.
 * @param props
 */
function Profile(props: Props) {
    const profile = props.profileData;

    // Set initial value for properties that are arrays. 
    // otherwise .map will complain during initial render. 

    // set affiliations
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
    // set researchInterests to an empty array inital render.
    let researchInterests: Array<string> = [];

    // set org to an empty org list for inital render.
    let orgs = [
        {
            name: '',
            url: ''
        }
    ];
    
    // Set researchInterests
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
    
    // conditional rendering of the profile tab pane
    if(props.userName.name !== ''){
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
                            <Input className="clear-disabled" disabled defaultValue={props.userName.userID} />
                            <Meta title="Position" />
                            <Input className="clear-disabled" defaultValue={setJobTitle()}/>
                            <Meta title="Department" />
                            <Input className="clear-disabled" disabled defaultValue={profile.department} />
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
                                <Card className="card-with-height" style={{ margin: '8px 0px' }} title="Research Interests">
                                    <ul style={{ textAlign: 'left' }}>
                                        {researchInterests.map((interest) => (
                                            <li key={interest}>{interest}</li>
                                        ))}
                                    </ul>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <OrgsContainer />
                            </Col>
                        </Row>
                        <Row>
                            {/* TODO:AKIYO FIX - when the box is very small it doesn't break or hide word */}
                            <Card
                                style={{ margin: '8px 0px' }}
                                title="Research or Personal Statement"
                            >
                                <TextArea autosize readOnly className='clear-disabled'  defaultValue={props.profileData.researchStatement}/>
                            </Card>
                            <Card style={{ margin: '8px 0px' }} title="Afflications">
                                <ul style={{ textAlign: 'left' }}>
                                    {setAffiliations().map((position, index) => (
                                        <li key={index}>
                                            {position.title} @ {position.organization}, {position.started} -{' '}
                                            {position.ended}{' '}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </Row>
                    </Col>
                </Row>
            </Row>
        );
    } 
    else {
        return(
            <div style={{ textAlign: 'center' }}><Spin size="large" /></div>
        )
    }
}
export default Profile;
