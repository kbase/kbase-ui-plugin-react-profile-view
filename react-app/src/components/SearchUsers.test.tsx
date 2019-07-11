import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';

import SearchUsers from './SearchUsers';
configure({ adapter: new Adapter() });

it('renders without crashing with correct type and data', () => {
    // TODO: shouldn't check tokens into github
    const token = 'xxx';
    const hostName = 'https://narrative.kbase.us';
    shallow(<SearchUsers token={token} hostName={hostName} />);
});
