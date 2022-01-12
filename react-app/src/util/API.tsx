import { ProfileUserdata, UserName } from '../redux/interfaces';

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
    if (response.status === 200) {
        try {
            return await response.json();
        } catch (err) {
            console.error('profile fetch failed', err);
            throw new Error(`Error parsing profile response to json: ${err instanceof Error ? err.message : 'Unknown error'}`);
        };
    } else {
        throw new Error(`Error fetching user profile: ${response.statusText}`);
    }
};

/**
 * update profile 
 * method 'UserProfile.update_user_profile' takes top level key of profile object. 
 * @param token 
 * @param baseURL 
 * @param userdata 
 * @param user
 */
export async function updateProfileAPI(token: string, url: string, userdata: ProfileUserdata, user: UserName) {
    const newParam = [{
        profile: {
            user: { realname: user.name, username: user.userID },
            profile: { userdata }
        }
    }];
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

export interface CustomFields {
    [k: string]: string;
}
// export interface GroupResourcesCount {
//     [k:string]: string
// }
// export interface GroupResources {
//     [k:string]: string
// }
export interface GroupsUser {
    name: string;
    joined: number;
    lastvisit: number;
    custom: CustomFields;
}
export interface Group {
    id: string;
    private: boolean;
    privatemembers: boolean;
    role: string;
    lastvisit: number;
    name: string;
    owner: GroupsUser,
    admins: Array<GroupsUser>,
    members: Array<GroupsUser>,
    memcount: number;
    createdate: number;
    moddate: number;
    // resources: GroupResources,
    // rescount: GroupResourcesCount,
    custom: CustomFields;
}


/**
 * returns list of orgs that profile and logged in user are both associated with.
 * @param id id of the profile
 * @param token kbase session cookie
 */
export async function fetchOrgsOfProfileAPI(username: string, token: string, baseURL: string) {
    const bffServiceUrl = await getBFFServiceUrl(token, baseURL);
    const url = bffServiceUrl + '/org_list/' + username;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: token
        }
    });
    if (response.status !== 200) {
        console.error('fetch org failed', response);
        throw new Error(`Error fetching groups: ${response.statusText}`);
    }
    try {
        return await (response.json() as unknown) as Array<Group>;
    } catch (err) {
        console.error('fetch org failed', response);
        throw new Error(`Error fetching groups: ${err instanceof Error ? err.message : "Unknown error"}`);
    };
};

// export async function fetchOrgsOfProfileAPI(username: string, token: string, baseURL: string) {
//     const bffServiceUrl = await getBFFServiceUrl(token, baseURL);
//     const url = bffServiceUrl + '/org_list/' + username;
//     const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//             Authorization: token
//         }
//     });
//     if (response.status !== 200) {
//         console.error('Org Fetch Error:', response);
//         return [response.status, response.statusText];
//     };
//     try {
//         const orgs = await response.json();
//         return orgs;
//     } catch (err) {
//         console.error('fetch org failed', response);
//         return [response.status, response.statusText];
//     };
// };

// export interface OrganizationBriefInfo {
//     owner: string;
//     rescount: {
//         workspace: number;
//     };
//     moddate: number;
//     private: boolean;
//     role: string;
//     memcount: number;
//     custom: {
//         homeurl: string;
//         relatedgroups: string;
//         logourl: string;
//         researchinterests: string;
//     };
//     name: string;
//     createdate: number;
//     lastvisit: number;
//     id: string;
// }

// export async function fetchOrgsOfProfileAPI(username: string, token: string, groupsURL: string): Promise<Array<OrganizationBriefInfo>> {
//     const url = `${groupsURL}/group?role=Member`;
//     const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//             Authorization: token
//         }
//     });
//     if (response.status !== 200) {
//         console.error('fetch org failed', response);
//         throw new Error(`Error fetching groups: ${response.statusText}`);
//     }
//     try {
//         return await response.json() as Array<OrganizationBriefInfo>;
//     } catch (err) {
//         console.error('fetch org failed', response);
//         throw new Error(`Error fetching groups: ${err.message}`);
//     };
// };

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
