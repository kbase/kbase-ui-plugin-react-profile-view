import React from 'react';
import { UserName, ProfileData, OrgProp } from '../../redux/interfaces';
import { Row, Col, Card } from 'antd';
import nouserpic from '../../assets/nouserpic.png';
const { Meta } = Card;

/**
 *  Profile.tsx is a view component
 *  Parent componenet - pages/Home.tsx
 *
 */

interface Props {
    token: string;
    userName: UserName;
    editEnable: Boolean;
    userProfile: ProfileData;
    orgs: Array<OrgProp>;
    gravatarHash: string;
    profileloaded: Boolean;
    orgsloaded: Boolean;
}
interface State {
    jobTitle: string;
    gravatarURL: string;
    gravatar: string;
    affiliations: [
        {
            title: string;
            organization: string;
            started: string;
            ended: string;
        }
    ];
    researchInterests: [];
    orgs: [
        {
            name: string;
            url: string;
        }
    ];
    profileloading: true;
}
/**
 * Returns profile component.
 * @param props
 */
class MockProfile extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            jobTitle: '',
            gravatarURL: '',
            gravatar: '',
            affiliations: [
                {
                    title: '',
                    organization: '',
                    started: '',
                    ended: ''
                }
            ],
            researchInterests: [],
            orgs: [
                {
                    name: '',
                    url: ''
                }
            ],
            profileloading: true,
        }
    }
    componentDidMount(){
            console.log('profile props', this.props)
    }
//     profile = this.props.userProfile;
// if (this.props.profileloaded) {
//         profileloading = false;
//     }
//     let orgloading = true;
//     if (props.orgsloaded) {
//         orgloading = false;
//     }
//     // Set affiliations
//     if (typeof profile.affiliations !== 'undefined') {
//         affiliations = profile.affiliations;
//     }

//     // Set researchInterests
//     if (typeof profile.researchInterests !== 'undefined' && Array.isArray(profile.researchInterests)) {
//         researchInterests = profile.researchInterests;
//     }
//     // Set jobTitle
//     if (profile.jobTitle === 'Other' && typeof profile.jobTitle !== 'undefined') {
//         jobTitle = profile.jobTitleOther;
//     } else if (typeof profile.jobTitle !== 'undefined') {
//         jobTitle = profile.jobTitle;
//     } else {
//         jobTitle = '';
//     }
//     // set orgs
//     if (props.orgs) {
//         orgs = props.orgs;
//     }
//     // Set gravatarURL
//     if (profile['avatarOption'] === 'silhoutte' || !props.gravatarHash) {
//         gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt="avatar" src={nouserpic} />;
//     } else if (props.gravatarHash) {
//         gravatarURL =
//             'https://www.gravatar.com/avatar/' + props.gravatarHash + '?s=300&amp;r=pg&d=' + profile.gravatarDefault;
//         gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt="avatar" src={gravatarURL} />;
//     }
    render(){
        return (
            <Row style={{ padding: 16 }}>
                <Row gutter={8}>
                    <Col span={8}>
                        <Card loading={profileloading} style={{ margin: '8px 0px', textAlign: 'center' }}>
                            {/* <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={ gravatarURL } /> */}
                            {gravatar}
                        </Card>
                        <Card
                            loading={profileloading}
                            style={{ margin: '8px 0px', textAlign: 'left' }}
                            title={props.userName.name}
                        >
                            <Meta title="User ID" />
                            <p>{props.userName.userID}</p>
                            <Meta title="Position" />
                            <p>{jobTitle}</p>
                            <Meta title="Department" />
                            <p>{profile.department}</p>
                            <Meta title="Organization" />
                            <p>{profile.organization}</p>
                            <Meta title="Location" />
                            <p>
                                {profile.city}, {profile.state}, {profile.country}
                            </p>
                            <Meta title="Primary Funding Source" />
                            <p>{profile.fundingSource}</p>
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Card className="card-with-height" loading={profileloading} style={{ margin: '8px 0px' }} title="Research Interests">
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
                            </Col>
                        </Row>
                        <Row>
                            {/* TODO:AKIYO FIX - when the box is very small it doesn't break or hide word */}
                            <Card
                                loading={profileloading}
                                style={{ margin: '8px 0px' }}
                                title="Research or Personal Statement"
                            >
                                {profile.researchStatement}
                            </Card>
                            <Card loading={profileloading} style={{ margin: '8px 0px' }} title="Afflications">
                                <ul style={{ textAlign: 'left' }}>
                                    {affiliations.map((position, index) => (
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
}

export default MockProfile;
