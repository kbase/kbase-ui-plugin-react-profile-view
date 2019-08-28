import React from 'react';
import { UserName, ProfileData, OrgProp } from '../../redux/interfaces';
import { Row, Col, Card, Input, Spin } from 'antd';
import Orgs from '../Orgs/Orgs';
import nouserpic from '../../assets/nouserpic.png';
const { Meta } = Card;
const { TextArea } = Input;

/**
 *  Profile.tsx is a view component
 *  Parent componenet - pages/Home.tsx
 *
 */

interface Props {
    baseURL: string;
    token: string;
    userName: UserName;
    editEnable: Boolean;
    profileData: ProfileData;
    orgs: Array<OrgProp>;
    gravatarHash: string;
    profileloaded: Boolean;
    orgsloaded: Boolean;
}


/**
 * Returns profile component.
 * @param props
 */
function Profile(props: Props) {
    console.log('profile props', props)
    const profile = props.profileData;
    // Set initial value to props for initial render and no-data
    //set affiliations
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

    let researchInterests: Array<string> = [];
    let orgs = [
        {
            name: '',
            url: ''
        }
    ];
    let orgloading = true;
    if (props.orgsloaded) {
        orgloading = false;
    }

    // Set researchInterests
    if (typeof profile.researchInterests !== 'undefined' && Array.isArray(profile.researchInterests)) {
        researchInterests = profile.researchInterests;
    }


    // function handleOnBlur(event) {
    //     console.log(event.target)
    // }
    let foo = undefined;

    // set orgs
    if (props.orgs) {
        orgs = props.orgs;
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
        console.log("when this setjobtitle goes?", profile.jobTitleOther)
        if (profile.jobTitle === 'Other' && typeof profile.jobTitle !== 'undefined') {
            return profile.jobTitleOther;
        } else if (typeof profile.jobTitle !== 'undefined') {
            return profile.jobTitle;
        } else {
            return '';
        }
    }
    const orgListEmpty = [{
            name: 'hahahah',
            url: 'hehehehe'
    }];

    if(props.userName.name !== ''){
        console.log("it claims it's not empty prop")
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
                                <Card className="card-with-height" loading={orgloading} style={{ margin: '8px 0px' }} title="Organizations">
                                    <ul style={{ textAlign: 'left' }}>
                                        {orgs.map((org, index) => (
                                            <li key={index}>
                                                <a href={org.url} target="_blank" rel="noopener noreferrer">
                                                    {org.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                                <Orgs orgList={orgListEmpty}/>
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
                                    {/* {affiliations.map((position, index) => ( */}
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
