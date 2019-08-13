import React from 'react';
import { UserName, ProfileData, OrgProp, Affiliation } from '../../redux/interfaces';
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
    userName: {
        name: string;
        userID: string;
    };
    userProfile: {
        organization: string;
        department: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        affiliations: Array<Affiliation>;
        researchStatement: string;
        jobTitle: string;
        researchInterests: Array<string>;
        fundingSource: string;
        gravatarDefault: string;
        avatarOption: string;
    }
    userProfileLoading: boolean;
    organizations: Array<OrgProp>;
    organizationsLoading: boolean;
    gravatar: any;
}
/**
 * Profile class component.
 * @param props
 */
class MockProfile extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            userName: {
                name: '',
                userID: ''
            },
            userProfile: {
                organization: '',
                department: '',
                city: '',
                state: '',
                postalCode: '',
                country: '',
                affiliations: [],
                researchStatement: '',
                jobTitle: '',
                researchInterests: [],
                fundingSource: '',
                gravatarDefault: '',
                avatarOption: ''
            },
            userProfileLoading: true,
            organizations: [],
            organizationsLoading: true,
            gravatar: <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt="avatar" src={nouserpic} />
        }
    }
    componentDidMount(){
        console.log('profile props', this.props);
        // after initial mounting, check props values
        // before setting the state and using them.
        if (this.props.userName) {
            this.setState({ userName: this.props.userName});
        }
        // if (this.props.gravatarHash) {
        //     this.setState({ gravatarHash: this.props.gravatarHash});
        // }
        // setting the state values into one variable: profile
        // to avoid multiple re-rendering.
        let profile = this.state.userProfile;
        for ( let key in this.props.userProfile ) {
            switch ( key ) {
                case 'researchInterests':
                    if (typeof this.props.userProfile.researchInterests === 'undefined' && Array.isArray(this.props.userProfile.researchInterests)) {
                        profile.researchInterests = this.props.userProfile.researchInterests;
                    }
                    break;
                case 'jobTitle':
                case 'jobTitleOther':
                    if (this.props.userProfile.jobTitle === 'Other' && typeof this.props.userProfile.jobTitle !== 'undefined') {
                        profile.jobTitle = this.props.userProfile.jobTitleOther;
                    } else if (typeof profile.jobTitle !== 'undefined') {
                        profile.jobTitle = this.props.userProfile.jobTitle;
                    }
                    break;
                case 'avatarOption':
                    // Set gravatarURL
                    if (this.props.userProfile.avatarOption === 'silhoutte' || !this.props.gravatarHash) {
                        this.setState({gravatar: <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt="avatar" src={nouserpic} />});
                    } else if (this.props.gravatarHash) {
                        let gravatarURL =
                            'https://www.gravatar.com/avatar/' + this.props.gravatarHash + '?s=300&amp;r=pg&d=' + profile.gravatarDefault;
                    this.setState({gravatar: <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt="avatar" src={gravatarURL} />});
                    }
                case 'organization':
                case 'department':
                case 'city':
                case 'state':
                case 'postalCode':
                case 'country':
                case 'researchStatement':
                case 'fundingSource':
                case 'gravatarDefault':
                    if (typeof this.props.userProfile[key] !== 'undefined') {
                        profile[key] = this.props.userProfile[key];
                    }
                break;
                default: 
                console.error("what did you change to get here....")
            }
        }
        this.setState({ 
            userProfile: profile, 
            userProfileLoading: false
        })
        // if (this.props.profileloaded) {
            //         profileloading = false;
            // }
            //     let orgloading = true;
            //     if (props.orgsloaded) {
                //         orgloading = false;
                //     }
        if (this.props.orgs) {
            this.setState({
                organizations: this.props.orgs,
                organizationsLoading: false
            })
        }
    }



    render(){
        return (
            <Row style={{ padding: 16 }}>
                <Row gutter={8}>
                    <Col span={8}>
                        <Card loading={this.state.userProfileLoading} style={{ margin: '8px 0px', textAlign: 'center' }}>
                            {/* <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={ gravatarURL } /> */}
                            {this.state.gravatar}
                        </Card>
                        <Card
                            loading={this.state.userProfileLoading}
                            style={{ margin: '8px 0px', textAlign: 'left' }}
                            title={this.state.userName.name}
                        >
                            <Meta title="User ID" />
                            <p>{this.state.userName.userID}</p>
                            <Meta title="Position" />
                            <p>{this.state.userProfile.jobTitle}</p>
                            <Meta title="Department" />
                            <p>{this.state.userProfile.department}</p>
                            <Meta title="Organization" />
                            <p>{this.state.userProfile.organization}</p>
                            <Meta title="Location" />
                            <p>
                                {this.state.userProfile.city}, {this.state.userProfile.state}, {this.state.userProfile.country}
                            </p>
                            <Meta title="Primary Funding Source" />
                            <p>{this.state.userProfile.fundingSource}</p>
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Card className="card-with-height" loading={this.state.userProfileLoading} style={{ margin: '8px 0px' }} title="Research Interests">
                                    <ul style={{ textAlign: 'left' }}>
                                        {this.state.userProfile.researchInterests.map((interest) => (
                                            <li key={interest}>{interest}</li>
                                        ))}
                                    </ul>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card className="card-with-height" loading={this.state.organizationsLoading} style={{ margin: '8px 0px' }} title="Organizations">
                                    <ul style={{ textAlign: 'left' }}>
                                        {this.state.organizations.map((org, index) => (
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
                                loading={this.state.userProfileLoading}
                                style={{ margin: '8px 0px' }}
                                title="Research or Personal Statement"
                            >
                                {this.state.userProfile.researchStatement}
                            </Card>
                            <Card loading={this.state.userProfileLoading} style={{ margin: '8px 0px' }} title="Afflications">
                                <ul style={{ textAlign: 'left' }}>
                                    {this.state.userProfile.affiliations.map((position, index) => (
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
