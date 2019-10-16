import React from 'react';

import { Tabs } from 'antd';

import ProfileClassContainer from '../components/Profile/ProfileClassCountainer';
import NarrativeContainer from '../components/Narratives';
import { OrgProp, UserName } from '../redux/interfaces';
import SearchUsersContainer from '../components/SearchUsers/SearchUsersContainer';

const TabPane = Tabs.TabPane;
/**
 * Class component that keeps states for all the variables that viewer/child components needs.
 * This can converted into Redux if needed.
 * Parent component App.tsx
 */

// add Narrative_detail if needed. Currently, data in the object is not used - Akiyo.
interface HomeState {
    userName: UserName;
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
    getProfile: (profileID: string) => void;
    getOrgs: (profileID: string) => void;
}

class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {
            userName: {
                name: '',
                userID: ''
            },
            narrativesLoaded: false,
            organizations: [],
            organizationsLoaded: false,
            gravatarHash: ''
        };
    };


    componentDidMount() {
        let username;
        if (this.props.username) {
            username = this.props.username;
            this.props.setTitle('User Profile for ' + username);
        } else {
            username = this.props.authUsername;
            this.props.setTitle('Your User Profile');
        }

        /**
        * fetch profile data for the diplayed profile
        * and load it to the profile component.
        *  @param {string} id  profile ID
        */
        this.props.getProfile(username); // reduux


        /**
         * fetch orgs that user blongs to the profile
         * and load them to the orgs component.
         *  @param {string} id  profile ID
         */
        this.props.getOrgs(username); //redux

        /**
         * Returns narratives that shows in Narrative table.
         *
         *
         * Below logic determines which set of narratives needs to be fetched.
         * if the viewing profile userid is not the logged in user,
         * then fetch all of shared and public narrative and filter with the viewing profile userid.
         */
        if (typeof this.props.username === 'undefined' || typeof this.props.authUsername === 'undefined') {
            // if there is no logged in user in run time config (redux app state)
            // returns an empty narrative list
            console.error('How did this even happened? Check error message from Kbase-UI.')
            return;
        } else {
            // when logged-in user is viewing own profile. 
            if (this.props.username === this.props.authUsername || this.props.username === null) {
                this.props.loadNarratives('mine', this.props.authUsername); // redux 
            } else {
                /**
                 * when logged in user is not viewing other user's profile
                 * pass filter "they" <-- gender-neutral singular they
                 * which tfetch both "public" and "shared" and filter response with profileID
                 */
                this.props.loadNarratives('they', this.props.username); // redux 
            };
        };
    };

    componentDidUpdate(prevProps: any, prevState: any) {
        // This privents from infinate component loading loop.
        if (this.state === prevState) {
            return;
        };
    };
    // wrap search user component with a div so that display can be controlled.
    // in order to place search component/box on the navigation tab, 
    // make it into a variable and insert it as tab title. 
    searchOnATab = <div className="search-on-a-tab">Search other users <SearchUsersContainer /></div>

    render() {
        return (
            <div className="profile-tabs">
                <Tabs type="line" defaultActiveKey="5">
                    {/* <TabPane  tab="Profile" key="1">
                        <ProfileContainer />
                    </TabPane> */}
                    <TabPane tab="Narratives" key="3">
                        <NarrativeContainer />
                    </TabPane>
                    <TabPane tab="Profile" key="5">
                        <ProfileClassContainer />
                    </TabPane>
                    {/* Insert search user component div as a title to place it on the navigation tab  */}
                    <TabPane disabled tab={this.searchOnATab} key="8"></TabPane>
                </Tabs>
            </div>
        );
    };
};

export default Home;
