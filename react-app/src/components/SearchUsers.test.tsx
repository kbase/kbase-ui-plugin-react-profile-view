import React from 'react';
import { configure  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow } from 'enzyme';

import SearchUsers from './SearchUsers';

it('renders without crashing with correct type and data', ()=>{
    const token = '3SLUNTKN5UABYMKHIB5QINDHTSQP4';
    const hostName = 'https://narrative.kbase.us';
    shallow(
       <SearchUsers token={token} hostName={hostName}/>
    );
});