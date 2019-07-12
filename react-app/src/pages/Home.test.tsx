import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ReactDOM from 'react-dom';
import Home from './Home';
configure({ adapter: new Adapter() });

function setTitle(title: string) {
    // does nothing
}
it('Home loads without crashing', () => {
    // TODO: shouldn't check tokens into github
    const token = 'xxx';
    const baseURL = 'https://ci.kbase.us';
    const loggedInUser = 'amarukawa';
    shallow(<Home token={token} baseURL={baseURL} username={null} authUsername={loggedInUser} setTitle={setTitle} />);
});
