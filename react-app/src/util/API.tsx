import { ProfileData, UserName } from '../redux/interfaces';

export async function getBFFServiceUrl(token: string, url: string) {
    // TODO: for dev, the baseUrl will be whatever works for the CRA workflow, which is ''.
    // baseURL = 'https://ci.kbase.us/services'; // for dev
    const body = {
        id: 0,
        method: 'ServiceWizard.get_service_status',
        version: '1.1',
        params: [
            {
                module_name: 'userprofileuibff',
                version: null
            }
        ]
    };
    const stringBody = JSON.stringify(body);
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            Authorization: token
        },
        body: stringBody
    });
    if (response.status !== 200) {
        // return empty string so that the fetch API called this function
        // can generate error messages. 
        return '';
    } else {
        const responseJson = await response.json();
        return responseJson.result[0]['url'];
    };
};

/**
 * Return profile data
 * @param id profile id
 * @param token KBase session cookie
 * @param baseUrl hostname
 */
export async function fetchProfileAPI(id: string, token: string, baseURL: string) {
    const bffServiceUrl = await getBFFServiceUrl(token, baseURL);
    let url = bffServiceUrl + '/fetchUserProfile/' + id;
    const response = await fetch(url, {
        method: 'GET'
    });
    if (response.status !== 200) {
        console.warn(response.status, response);
        return [response.status, response.statusText];
    } else {
        try {
            const profile = await response.json();
            return profile;
        } catch (err) {
            console.error('profile fetch failed', response);
            return [response.status, response.statusText];
        };
    };
};

/**
 * update profile 
 * method 'UserProfile.update_user_profile' takes top level key of profile object. 
 * @param token 
 * @param baseURL 
 * @param userdata 
 * @param user
 */
export async function updateProfileAPI(token: string, url: string, userdata: ProfileData, user: UserName) {
    let newParam = [{ profile: { user: { realname: user.name, username: user.userID }, profile: { userdata: userdata } } }];
    const body = {
        version: '1.1',
        method: 'UserProfile.update_user_profile',
        params: newParam
    };
    const stringBody = JSON.stringify(body);
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            Authorization: token,
            'Content-Type': 'application/json'
        },
        body: stringBody
    });
    if (response.status === 200) {
        return (response.status);
    } else {
        let responseJSON = await response.json();
        let responseArray: Array<number | string> = [
            response.status,
            responseJSON.error.message
        ];
        return responseArray;
    };
};

/**
 * Return list of narratives
 * @param param shared/mine/public
 * @param token kbase session cookie
 */
export async function fetchNarrativesAPI(param: string, token: string, baseURL: string) {
    const bffServiceUrl = await getBFFServiceUrl(token, baseURL);
    let url = bffServiceUrl + '/narrative_list/' + param;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: token
        }
    });
    if (response.status === 500) {
        console.error('Fetch Narratives 500 response:', response);
        return [response.status, response.statusText];
    };
    try {
        const narratives = await response.json();
        return narratives;
    } catch (err) {
        console.error('fetch narratives failed', response);
        return [response.status, response.statusText];
    };
};

/**
 * returns list of orgs that profile and logged in user are both associated with.
 * @param id id of the profile
 * @param token kbase session cookie
 */
export async function fetchOrgsOfProfileAPI(id: string, token: string, baseURL: string) {
    const bffServiceUrl = await getBFFServiceUrl(token, baseURL);
    const url = bffServiceUrl + '/org_list/' + id;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: token
        }
    });
    if (response.status !== 200) {
        console.error('Org Fetch Error:', response);
        return [response.status, response.statusText];
    };
    try {
        const orgs = await response.json();
        return orgs;
    } catch (err) {
        console.error('fetch org failed', response);
        return [response.status, response.statusText];
    };
};

/**
 * returns list of users that are filtered by search values
 * @param searchValue search values
 * @param token kbase session cookie
 */
export async function filteredUserAPI(searchValue: string, token: string, url: string) {
    const body = {
        version: '1.1',
        method: 'UserProfile.filter_users',
        params: [{ filter: searchValue }]
    };
    const stringBody = JSON.stringify(body);
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            Authorization: token,
            'Content-Type': 'application/json'
        },
        body: stringBody
    });
    if (response.status === 500) {
        console.error('500 response:', response);
        return [response.status, response.statusText];
    };
    try {
        const res = await response.json();
        // if you try to: return response.json, it will get error below
        // Unhandled Rejection (TypeError): Failed to execute 'json' on 'Response': body stream is locked
        // but assiging it to a vairable somehow magically works.
        return res;
    } catch (err) {
        console.error('fetch search users failed', response);
        return [response.status, response.statusText];
    };
};
