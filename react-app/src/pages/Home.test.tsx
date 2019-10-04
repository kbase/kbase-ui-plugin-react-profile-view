import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Home from './Home';
configure({ adapter: new Adapter() });

let loadNarratives = (filter: string, profileID: string) => {};
let getProfile = (profileID: string) => {};
let getOrgs=(profileID: string) => {};
let setTitle= (title: string) => {};

it('Home loads without crashing', () => {
    // TODO: shouldn't check tokens into github
    const token = 'xxx';
    const baseURL = 'https://ci.kbase.us';
    const loggedInUser = 'amarukawa';
    shallow(<Home 
                token={token} 
                authUsername={loggedInUser}
                username={null} 
                baseURL={baseURL} 
                setTitle={setTitle}
                loadNarratives={loadNarratives}
                getProfile={getProfile}
                getOrgs={getOrgs}
            />);
});
