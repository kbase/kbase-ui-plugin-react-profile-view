import React from 'react';

import { configure  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { shallow } from 'enzyme';

import Narratives from './Narratives';


it('renders without crashing with correct type and data', ()=>{

    const token = 'X4QQGMLPKTRDZARHFTH3KSP64XDYQEPI';
    const loggedInUser = 'amarukawa';
    const narratives = [
        {
            wsID: '50000',
            permission: 'a',
            name: 'Bronko',
            last_saved: 0,
            users: {},
            narrative_detail: {creator: 'Luna'}
        }
    ];
    const narrativesloaded = false;
    shallow(
        <Narratives 
        token={token}
        loggedInUser={loggedInUser}
        narratives={narratives}
        narrativesloaded={narrativesloaded}
        />
    );
});

it('renders without crashing with bad type and data', ()=>{

    const token = 'X4QQGMLPKTRDZARHFTH3KSP64XDYQEPI';
    const loggedInUser = 1234 as unknown;
    const narratives = [
        {
            wsID: 50000,
            permission: 4,
            name: 1234,
            last_saved: "me",
            users: {},
            narrative_detail: {creator: 4567}
        }
    ];
    const narrativesloaded = 'boo';
    shallow(
        <Narratives 
        token={token as string}
        loggedInUser={loggedInUser as string}
        narratives={narratives as Array<any>}
        narrativesloaded={narrativesloaded as boolean}
        />
    );
});



