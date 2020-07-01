import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';

import Narratives from './Narratives';

configure({ adapter: new Adapter() });

it('renders without crashing with correct type and data', () => {
    // TODO: shouldn't check tokens into github
    const token = 'xxx';
    const loggedInUser = 'amarukawa';
    const narratives = [
        {
            wsID: '50000',
            permission: 'a',
            name: 'Bronko',
            last_saved: 0,
            users: {},
            owner: '',
            narrative_detail: { creator: 'Luna' }
        }
    ];
    const narrativesloaded = false;
    shallow(
        <Narratives
            narratives={narratives}
            narrativesloaded={narrativesloaded}
        />
    );
});

it('renders without crashing with empty array', () => {
    // TODO: shouldn't check tokens into github
    const token = 'xxx';
    const loggedInUser = 'amarukawa';
    const narratives = [];
    const narrativesloaded = false;
    shallow(
        <Narratives
            narratives={narratives}
            narrativesloaded={narrativesloaded}
        />
    );
});

it('renders without crashing with bad type and data', () => {
    // TODO: shouldn't check tokens into github
    const token = 'xxx';
    const loggedInUser = 1234 as unknown;
    const narratives = [
        {
            wsID: 50000,
            permission: 4,
            name: 1234,
            last_saved: 'me',
            users: {},
            onwer: '',
            narrative_detail: { creator: 4567 }
        }
    ];
    const narrativesloaded = 'boo';
    shallow(
        <Narratives
            narratives={narratives as Array<any>}
            narrativesloaded={narrativesloaded as boolean}
        />
    );
});
