const bffServiceUrl = 'http://localhost:5000';
// TODO: make sure to get rid of local host 3000
// TODO: response.json() It returns a promise so make sure to change all of them into await!  
const serviceUrl = 'https://kbase.us/services';


/**
 * Return profile data
 * @param id profile id
 */
export async function fetchProfileAPI(id: string) {
    let url = bffServiceUrl + '/fetchUserProfile/' + id;
    const response = await fetch(url, {
        method: 'GET'
    });
    if (response.status === 404) {
        console.warn("404 response:", response);
    }
    else if (response.status === 500) {
        console.error("500 response:", response);
        return;
    }
    try {
        const profile = await response.json();
        return profile;
    }
    catch (err) {
        console.error('profile fetch failed', response);
    }
    
}

/**
 * Return list of narratives
 * @param param shared/mine/public
 * @param token kbase session cookie
 */
export async function fetchNarrativesAPI(param:string, token:string) {
    let url = bffServiceUrl + '/narrative_list/'+param;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: token
        }
    });
    if (response.status === 500) {
        console.error("Fetch Narratives 500 response:", response);
        return;
    }
    try {
        const narratives = await response.json();
        return narratives;
    }
    catch (err) {
        console.error('fetch narratives failed', response)
    }
}

/**
 * returns list of orgs that profile and logged in user are both associated with.
 * @param id id of the profile 
 * @param token kbase session cookie
 */
export async function fetchOrgsOfProfileAPI(id:string, token:string) {
    const url = bffServiceUrl + '/org_list/' + id;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: token
        }
    });
    if (response.status === 500) {
        console.error("500 response:", response);
        return;
    }
    try {
        const orgs = await response.json();
        return orgs;
    }
    catch (err) {
        console.error('fetch org failed', response)
    }
}

/**
 * returns list of users that are filtered by search values
 * @param searchValue search values
 * @param token kbase session cookie
 */
export async function filteredUserAPI(searchValue:string, token: string){
    const body = {
        'version': '1.1',
        'method': 'UserProfile.filter_users',
        'params': [{'filter': searchValue}]
    }
    const stringBody = JSON.stringify(body);

    const url = serviceUrl + '/user_profile/rpc'
    const response = await fetch(url,{
        method: 'POST',
        mode: 'cors',
        headers: {
            Authorization: token,
            'Content-Type': 'application/json'
        },
        body: stringBody
    });
    if (response.status === 500) {
        console.error("500 response:", response);
        return;
    }
    try {
        const res = await response.json();
        // if you try to: return response.json, it will get error below
        // Unhandled Rejection (TypeError): Failed to execute 'json' on 'Response': body stream is locked
        // but assiging it to a vairable somehow magically works.
        return res;
    } 
    catch (err) {
        console.error('fetch search users failed', response)
    }
}

/**
 * returns uesr id of the logged in user
 * @param token kbase session cookie
 */
export async function fetchLoggedInUserAPI(token:string) {
    const authMeUrl = serviceUrl + '/auth/me';
    let response;
    try {
        response = await fetch(authMeUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        });
        
    }
    catch (error) {
        console.error("fetch logged user failed", error);
    }
    if ( response ) {
        try {
            const res_json = await response.json();
            return res_json.user;
        }
        catch (error) {
            console.error("fetch logged user failed", error);
        }
    }
}
