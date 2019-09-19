import { ProfileData } from "../redux/interfaces";

export async function getBFFServiceUrl(token: string, baseURL: string) {
    // TODO: for dev, the baseUrl will be whatever works for the CRA workflow, which is ''.
    // baseURL = 'https://ci.kbase.us/services'; // for dev
    let url = baseURL + '/services/service_wizard';
    const body = {
        id: 0,
        method: 'ServiceWizard.get_service_status',
        version: '1.1',
        params: [
            {
                module_name: 'bff',
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
    const responseJson = await response.json();
    console.log("getBFFServiceUrl", responseJson)
    return responseJson.result[0]['url'];
}

/**
 * Return profile data
 * @param id profile id
 * @param token KBase session cookie
 * @param baseUrl hostname
 */
export async function fetchProfileAPI(id: string, token: string, baseURL: string) {
    const bffServiceUrl = await getBFFServiceUrl(token, baseURL);
    let url = bffServiceUrl + '/fetchUserProfile/' + id;
    let errorStatus;
    const response = await fetch(url, {
        method: 'GET'
    });
    console.log("fetchProfileAPI", response)
    if (response.status === 404) {
        console.warn('404 response:', response);
        return [response.status, response.statusText]
    } else if (response.status === 500) {
        console.error('500 response:', response);
        return [response.status, response.statusText]
    }
    try {
        const profile = await response.json();
        return profile;
    } catch (err) {
        console.error('profile fetch failed', response);
        return [response.status, response.statusText]
    }
}

/**
 * update profile 
 * method "UserProfile.update_user_profile" takes top level key of profile object. 
 * @param token 
 * @param baseURL 
 * @param userdata 
 */
export async function updateProfileAPI(token: string, baseURL: string, userdata:ProfileData) {
    // console.log(userdata)

// export async function updateProfileAPI(token: string, baseURL: string, updatedUserProfleString:string) {
    const body = {
        version: '1.1',
        method: 'UserProfile.update_user_profile',
        params: [ { profile: { user: { realname: "Akiyo Marukawa", username: "amarukawa" }, profile: {userdata: userdata}}}]
        // params: [ { profile: { user: { realname: "Akiyo Marukawa", username: "amarukawa" }, userdata: userdata}}]
    };
    const stringBody = JSON.stringify(body);
    //TODO: Akiyo - remove this after testing
    baseURL = 'https://ci.kbase.us';
    const url = baseURL + '/services/user_profile/rpc';
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            Authorization: token,
            'Content-Type': 'application/json'
        },
        body: stringBody
    });
    return(response.status);
}

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
        return;
    }
    try {
        const narratives = await response.json();
        return narratives;
    } catch (err) {
        console.error('fetch narratives failed', response);
    }
}

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
    if (response.status === 500) {
        console.error('500 response:', response);
        return;
    }
    try {
        const orgs = await response.json();
        return orgs;
    } catch (err) {
        console.error('fetch org failed', response);
    }
}

/**
 * returns list of users that are filtered by search values
 * @param searchValue search values
 * @param token kbase session cookie
 */
export async function filteredUserAPI(searchValue: string, token: string, baseURL: string) {
    const body = {
        version: '1.1',
        method: 'UserProfile.filter_users',
        params: [{ filter: searchValue }]
    };
    const stringBody = JSON.stringify(body);
    const url = baseURL + '/services/user_profile/rpc';
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
        return;
    }
    try {
        const res = await response.json();
        // if you try to: return response.json, it will get error below
        // Unhandled Rejection (TypeError): Failed to execute 'json' on 'Response': body stream is locked
        // but assiging it to a vairable somehow magically works.
        return res;
    } catch (err) {
        console.error('fetch search users failed', response);
    }
}
