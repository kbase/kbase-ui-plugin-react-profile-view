import React from 'react';

import { Tabs } from 'antd';

import ProfileContainer from '../components/Profile/ProfileContainer';
import NarrativeContainer from '../components/Narratives';
import { OrgProp, Org, ProfileData,  UserName } from '../redux/interfaces';
import SearchUsersContainer from '../components/SearchUsers/SearchUsersContainer';
import { fetchOrgsOfProfileAPI } from '../util/API';


const TabPane = Tabs.TabPane;
/**
 * Class component that keeps states for all the variables that viewer/child components needs.
 * This can converted into Redux if needed.
 * Parent component App.tsx
 */

// add Narrative_detail if needed. Currently, data in the object is not used - Akiyo.
interface HomeState {
    userName: UserName;
    userProfile: ProfileData;
    userProfileLoaded: Boolean;
    editEnable: Boolean; // profile edit enable 
    narrativesLoaded: Boolean;
    organizations: Array<OrgProp>;
    organizationsLoaded: Boolean;
    gravatarHash: string;
}


export interface HomeProps {
    token: string;
    authUsername: string;
    username: string | null;
    baseURL: string;
    setTitle: (title: string) => void;
    loadNarratives: (filter: string, profileID: string) => void;
    loadProfile: (profileID: string) => void;
    updateProfile: (profileID: string) => void;
}

class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {
            userName: {
                name: '',
                userID: ''
            },
            editEnable: false,
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
                jobTitleOther: '',
                researchInterests: [],
                fundingSource: '',
                gravatarDefault: '',
                avatarOption: ''
            },
            userProfileLoaded: false,
            narrativesLoaded: false,
            organizations: [],
            organizationsLoaded: false,
            gravatarHash: ''
        };
    }


    componentDidMount() {
        console.log('homeprops in compDidMount', this.props)
        let username;
        if (this.props.username) {
            username = this.props.username;
            this.props.setTitle('User Profile for ' + username);
        } else {
            username = this.props.authUsername;
            this.props.setTitle('Your User Profile');
            this.setState({ editEnable: true })
        }

        this.props.loadProfile(username); // reduux
        // /**
        //  * fetch user profile
        //  *  @param {string} id  profile ID
        //  */
        // fetchProfileAPI(username, this.props.token, this.props.baseURL).then((response) => {
        //     console.log('user profile response', response)
        //     if (typeof response !== 'undefined') {
        //         // if (this.props.username) {
        //         //     this.props.setTitle('User Profile for ' + response.user.realname);
        //         // }
        //         this.setState({
        //             userName: {
        //                 name: response.user.realname,
        //                 userID: response.user.username
        //             },
        //             gravatarHash: response.profile.synced.gravatarHash,
        //             userProfile: response.profile.userdata,
        //             userProfileLoaded: true
        //         });
        //     } else {
        //         // something went wrong during fetching.
        //         this.setState({
        //             userName: {
        //                 name: 'Something went wrong. Please check console for error messages..',
        //                 userID: ''
        //             }
        //         });
        //     }
        // });

        /**
         * fetch orgs that user blongs to the profile
         *  @param {string} id  profile ID
         */
        fetchOrgsOfProfileAPI(username, this.props.token, this.props.baseURL).then((response: Array<Org>) => {
            let orgArr: Array<OrgProp> = [];
            if (typeof response !== 'undefined') {
                response.forEach((org) => {
                    orgArr.push({ name: org.name, url: this.props.baseURL + '/#org/' + org.id });
                });
                this.setState({
                    organizations: orgArr,
                    organizationsLoaded: true
                });
            } else {
                // something went wrong during fetching.
                this.setState({
                    organizations: [
                        { name: 'Something went wrong. Please check console for error messages.', url: '' }
                    ],
                    organizationsLoaded: true
                });
            }
        });

        /**
         * Returns narratives that shows in Narrative table.
         *
         *
         * Below logic determines which set of narratives needs to be fetched.
         * if the viewing profile userid is not the logged in user,
         * then fetch all of shared and public narrative and filter with the viewing profile userid.
         */
        if (typeof this.props.username === 'undefined'|| typeof this.props.authUsername === 'undefined') {
            // if there is no logged in user in run time config (redux app state)
            // returns an empty narrative list

            //TODO: AKIYO OMG WHAT AM I GOING TO DO HERE!!
            return;
        } else {            
            // when logged-in user is viewing own profile. 
            if (this.props.username === this.props.authUsername || this.props.username === null) {
                console.log("fetch 'mine'")
                    this.props.loadNarratives('mine', this.props.authUsername ); // redux 
            } else {
                /**
                 * when logged in user is not viewing other user's profile
                 * pass filter "they" <-- gender-neutral singular they
                 * which tfetch both "public" and "shared" and filter response with profileID
                 */

                console.log("fetch 'they'")
                this.props.loadNarratives('they', this.props.username); // redux 

            }
        }
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        console.log('homeprops in compDidUpdate', this.props)
        // This privents from infinate component loading loop.
        if (this.state === prevState) {
            return;
        }
    }
    // wrap search user component with a div so that display can be controlled.
    // in order to place search component/box on the navigation tab, 
    // make it into a variable and insert it as tab title. 
    searchOnATab = <div className="search-on-a-tab">Search other users <SearchUsersContainer /></div>
    
    render() {
        return (
            <div className="profile-tabs">
                <Tabs type="line" defaultActiveKey="1">
                    <TabPane  tab="Profile" key="1">
                        <ProfileContainer />
                    </TabPane>
                    <TabPane tab="Narratives" key="3">
                        <NarrativeContainer />
                    </TabPane>
                    {/* Insert search user component div as a title to place it on the navigation tab  */}
                    <TabPane disabled tab={this.searchOnATab} key="8"></TabPane>
                </Tabs>
            </div>
        );
    }
}

export default Home;
