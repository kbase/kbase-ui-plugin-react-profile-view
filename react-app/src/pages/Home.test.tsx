import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Home from './Home';
configure({ adapter: new Adapter() });

function setTitle(title: string) {
    // does nothing
}
let loadNarratives = (filter: string, profileID: string) => {};
let loadProfile = (profileID: string) => {};
let updateProfile = (profileID: string) => {};
let loadOrgs = (profileID: string) => {};
it('Home loads without crashing', () => {
    // TODO: shouldn't check tokens into github
    const token = 'xxx';
    const baseURL = 'https://ci.kbase.us';
    const loggedInUser = 'amarukawa';
    shallow(<Home 
                token={token} 
                baseURL={baseURL} 
                username={null} 
                authUsername={loggedInUser} 
                setTitle={setTitle}
                loadNarratives={loadNarratives}
                loadProfile={loadProfile}
                updateProfile={updateProfile}
                loadOrgs={loadOrgs}
            />);
});
