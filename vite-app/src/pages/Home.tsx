import { Tabs, TabsProps } from 'antd';
import React from 'react';

import NarrativeContainer from '../components/Narratives';
import ProfileContainer from '../components/Profile/ProfileContainer';
import SearchUsersContainer from '../components/SearchUsers/SearchUsersContainer';
import { Org } from '../redux/interfaces';

import { UserProfileUser } from '../util/API';
import './Home.css';

/**
 * Class component that keeps states for all the variables that viewer/child components needs.
 * This can converted into Redux if needed.
 * Parent component App.tsx
 */

// add Narrative_detail if needed. Currently, data in the object is not used - Akiyo.

export interface HomeProps {
    token: string;
    authUsername: string;
    username: string | null;
    baseURL: string;
    setTitle: (title: string) => void;
    loadNarratives: (filter: string, username: string) => void;
    getProfile: (username: string) => void;
    getOrgs: (username: string) => void;
    getORCIDId: (username: string) => void;
}

interface HomeState {
    user: UserProfileUser;
    narrativesLoaded: boolean;
    organizations: Array<Org>;
    organizationsLoaded: boolean;
    gravatarHash: string;
}

class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {
            user: {
                realname: '',
                username: ''
            },
            narrativesLoaded: false,
            organizations: [],
            organizationsLoaded: false,
            gravatarHash: ''
        };
    }

    componentDidMount() {
        let profileUsername: string;
        if (this.props.username) {
            profileUsername = this.props.username;
            this.props.setTitle('User Profile for ' + profileUsername);
        } else {
            profileUsername = this.props.authUsername;
            this.props.setTitle('Your User Profile');
        }

        /**
        * fetch profile data for the diplayed profile
        * and load it to the profile component.
        *  @param {string} id  profile ID
        */
        this.props.getProfile(profileUsername); // reduux


        /**
         * fetch orgs that user belongs to the profile
         * and load them to the orgs component.
         *  @param {string} id  profile ID
         */
        this.props.getOrgs(profileUsername); //redux

        this.props.getORCIDId(profileUsername);

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
            console.error('How did this even happened? Check error message from Kbase-UI.');
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
            }
        }
    }

    componentDidUpdate(_: HomeProps, prevState: HomeState) {
        // This prevents from infinite component loading loop.
        // TODO: well, we probably need to redesign something here...
        if (this.state === prevState) {
            return;
        }
    }

    // wrap search user component with a div so that display can be controlled.
    // in order to place search component/box on the navigation tab, 
    // make it into a variable and insert it as tabBarExtraContent. 
    searchOnATab = <div className="search-on-a-tab">Search other users <SearchUsersContainer /></div>;

    render() {
        const items: TabsProps['items'] = [{
            key: 'profile',
            label: 'Profile',
            children: <ProfileContainer />
        }, {
            key: 'narratives',
            label: 'Narratives',
            children: <NarrativeContainer />
        }]
        return (
            <div className="Home">
                <Tabs type="card"
                    animated={false}
                    className="FullHeight-tabs"
                    defaultActiveKey="profile"
                    tabBarExtraContent={this.searchOnATab}
                    items={items}
                />
            </div>
        );
    }
}

export default Home;
