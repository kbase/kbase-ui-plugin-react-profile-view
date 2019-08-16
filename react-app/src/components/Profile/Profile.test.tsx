import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, render, mount } from 'enzyme';
import Profile from './Profile';
import { ProfileData, UserName, OrgProp } from '../../pages/Home';

configure({ adapter: new Adapter() }); //interface

/**
 * Test if it loads without crashing
 *  - with correct type and data
 *  - with really bad data
 *  - with undefined everything data
 *
 * Test if it can find elements
 */
it('renders without crashing with correct type and data', () => {
    const userName: UserName = {
        name: 'akiyo maruakwa',
        userID: 'amarukawa'
    };
    // TODO: shouldn't check tokens into github
    const token = 'xxx';
    const userProfile: ProfileData = {
        organization: 'Current organiztaion',
        department: 'Current department',
        city: 'Current city',
        state: 'Current State',
        postalCode: '',
        country: 'usa',
        affiliations: [
            { title: 'past job title 1', organization: 'past org 1', started: 'started 1', ended: 'ended 1' },
            { title: 'past job title 2', organization: 'past org 2', started: 'started 2', ended: 'ended 2' }
        ],
        researchStatement: 'blah blah',
        jobTitle: 'Current Job Title',
        jobTitleOther: '',
        researchInterests: ['foo', 'bar', 'baz'],
        fundingSource: "I don't have any money",
        gravatarDefault: 'mm',
        avatarOption: ''
    };
    const orgs: Array<OrgProp> = [
        {
            name: 'Bronco',
            url: 'https://about.google/intl/en/?fg=1&utm_source=google-US&utm_medium=referral&utm_campaign=hp-header'
        }
    ];
    const gravatarHash = 'ceccacd4f6311e66cdf51f1666be71a9';
    const profileloaded = true;
    const orgsloaded = true;

    shallow(
        <Profile
            userName={userName}
            userProfile={userProfile}
            orgs={orgs}
            gravatarHash="ceccacd4f6311e66cdf51f1666be71a9"
            profileloaded={profileloaded}
            orgsloaded={orgsloaded}
            token={token}
        />
    );
});

it('renders without crashing with REALLY bad data', () => {
    const userName = {
        name: 'akiyo maruakwa',
        userID: 12345
    } as unknown;
    const userProfile = {
        organization: 12345,
        department: 'baaar',
        city: 'baazz',
        state: 'ca',
        postalCode: 12345,
        country: 'usa',
        affiliations: [123, 456, 234],
        researchStatement: '',
        jobTitle: 'Other',
        jobTitleOther: 'other job title',
        researchInterests: 'why not',
        fundingSource: '',
        gravatarDefault: 'mm',
        avatarOption: ''
    } as unknown;
    const orgs = [{ name: 'org string', url: 1234 }];
    const gravatarHash = '';
    const profileloaded = true;
    const orgsloaded = true;
    // TODO: shouldn't check tokens into github
    const token = 'xxx';

    shallow(
        <Profile
            userName={userName as UserName}
            userProfile={userProfile as ProfileData}
            orgs={orgs as Array<OrgProp>}
            gravatarHash={gravatarHash}
            profileloaded={profileloaded}
            orgsloaded={orgsloaded}
            token={token}
        />
    );
});

it('renders without crashing with all props undefined', () => {
    const userName = {
        name: undefined,
        userID: undefined
    } as unknown;
    const userProfile = {
        organization: undefined,
        department: undefined,
        city: undefined,
        state: undefined,
        postalCode: undefined,
        country: undefined,
        affiliations: undefined,
        researchStatement: undefined,
        jobTitle: undefined,
        jobTitleOther: undefined,
        researchInterests: undefined,
        fundingSource: undefined,
        gravatarDefault: undefined,
        avatarOption: undefined
    } as unknown;
    const orgs = undefined as unknown;
    const gravatarHash = undefined;
    const profileloaded = undefined;
    const orgsloaded = undefined;
    // TODO: shouldn't check tokens into github
    const token = 'xxx';
    shallow(
        <Profile
            userName={userName as UserName}
            userProfile={userProfile as ProfileData}
            orgs={orgs as Array<OrgProp>}
            gravatarHash={gravatarHash as string}
            profileloaded={profileloaded as Boolean}
            orgsloaded={orgsloaded as Boolean}
            token={token}
        />
    );
});
