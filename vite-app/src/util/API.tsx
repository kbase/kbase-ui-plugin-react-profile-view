import UserProfileClient from '@kbase/ui-lib/lib/comm/coreServices/UserProfile';
import { JSONValue } from '@kbase/ui-lib/lib/json';
import { SERVICE_CALL_TIMEOUT } from '../constants';
import { JSONObject, assertJSONObject, isJSONArray, isJSONObject } from './json';
import { hasOwnProperty } from './utils';

export async function getBFFServiceUrl(token: string, url: string) {
    // TODO: for dev, the baseUrl will be whatever works for the CRA workflow, which is ''.
    // baseURL = 'https://ci.kbase.us/services'; // for dev
    const body = {
        method: 'ServiceWizard.get_service_status',
        version: '1.1',
        id: "123",
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
    }
}

export interface UserProfileMetadata {
    createdBy: string;
    created: string;
}

export interface UserProfilePreferenceSetting {
    value: JSONValue;
    createdAt: number;
    updatedAt: number;
}

export type UserProfilePreferences = Record<string, UserProfilePreferenceSetting>

export interface UserProfileAffiliation {
    title: string;
    organization: string;
    started: number;
    ended?: number | null;
}

export type UserProfileAffiliations = Array<UserProfileAffiliation>

// TODO: not sure about whether nullable fields should be allowed or preferred, or if they should just be optional.
export interface UserProfileUserdata {
    // Required by form so should always be present
    avatarOption: string;

    // Optional
    organization?: string | null;
    department?: string;
    gravatarDefault?: string; // not required unless avatarOptions === 'gravatar'
    affiliations?: UserProfileAffiliations
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    researchStatement?: string;
    researchInterests?: Array<string>;
    researchInterestsOther?: string | null;
    jobTitle?: string;
    jobTitleOther?: string;
    fundingSource?: string
}

export interface UserProfileSynced {
    gravatarHash: string;
}

export interface UserProfilePluginSetting<T> {
    setting: T;
}

export interface UserProfilePluginSettingsDataSearch {
    history: {
        search: {
            history: Array<string>;
            time: {
                $numberLong: string
            }
        }
    }
}

export interface UserProfilePluginSettingsJGISearch {
    history: {
        search: {
            history: Array<string>;
            time: {
                $numberLong: string
            }
        }
    },
    jgiDataTerms: {
        agreed: boolean,
        time: {
            $numberLong: string
        }
    }
}

export interface UserProfilePluginSettingsPublicSearch {
    history: {
        search: {
            history: Array<string>;
            time: {
                $numberLong: string
            }
        }
    }
}

export interface UserProfilePluginSettingsUserProfile {
    displayORCID?: boolean;
}

export interface UserProfilePlugins {
    "data-search"?: UserProfilePluginSetting<UserProfilePluginSettingsDataSearch>
    "jgi-search"?: UserProfilePluginSetting<UserProfilePluginSettingsJGISearch>
    "public-search"?: UserProfilePluginSetting<UserProfilePluginSettingsPublicSearch>
    "user-profile"?: UserProfilePluginSetting<UserProfilePluginSettingsUserProfile>
}

export interface UserProfileSurveyData {
    referralSources: {
        question: string;
        response: Record<string, string>
    }
}

export interface UserProfileUser {
    username: string;
    realname: string;
}

export interface UserProfileProfile {
    metadata: UserProfileMetadata;
    userdata: UserProfileUserdata;
    synced: UserProfileSynced;
    preferences?: UserProfilePreferences;
    plugins?: UserProfilePlugins;
    surveydata?: UserProfileSurveyData
}




export interface UserProfile {
    user: UserProfileUser,
    profile: UserProfileProfile,
}

export interface UserProfileUpdate {
    user: UserProfileUser;
    profile: {
        userdata: UserProfileUserdata;
        preferences: UserProfilePreferences;
    }
}

export function convertNumberLong(valueFromMongo: JSONObject): JSONObject {
    function convert(value: JSONValue): JSONValue {
        if (isJSONObject(value)) {
            if (hasOwnProperty(value, '$numberLong') && (typeof value.$numberLong === 'string')) {
                return parseInt(value.$numberLong);
            } else {
                return Object.entries(value).reduce<Record<string, JSONValue>>((obj, [key, value]) => {
                    obj[key] = convert(value);
                    return obj;
                }, {}) as JSONObject;
            }
        } else if (isJSONArray(value)) {
            return value.map((item) => {
                return convert(item);
            })
        } else {
            return value;
        }
    }
    return convert(valueFromMongo) as JSONObject;
}

/**
 * Profile 
 */

/**
 * user profile service uses this type
 * typedef structure {
        User user;
        UnspecifiedObject profile;
    } UserProfile;
 *  "UnspecifiedObject profile;"
 * is specified below
 */
// export interface UserProfileService {
//     user: UsernameRealname;
//     profile: {
//         userdata: ProfileUserdata,
//         synced: {
//             gravatarHash: string;
//         };
//         // TODO: the rest of the profile structure, at least preserved
//         // as any??
//     };

// }

// TODO: Yikes, this should actually be called fixProfile!
function fixProfile(rawPossibleProfile: unknown): UserProfile {
    assertJSONObject(rawPossibleProfile);

    const possibleProfile = convertNumberLong(rawPossibleProfile);

    if (!isJSONObject(possibleProfile)) {
        throw new Error("User profile is not an object");
    }

    if (!hasOwnProperty(possibleProfile, 'user')) {
        throw new Error('User profile missing "user" property');
    }

    if (!hasOwnProperty(possibleProfile, "profile")) {
        throw new Error('User profile missing "profile" property');
    }

    const profile = possibleProfile.profile;

    if (!isJSONObject(profile)) {
        throw new Error('User profile "profile" is not an object');
    }

    if (!hasOwnProperty(profile, "userdata")) {
        throw new Error('User profile missing "userdata" property');
    }
    const userdata = profile.userdata;
    if (!isJSONObject(userdata)) {
        throw new Error('User profile "userdata" is not an object');
    }

    if (hasOwnProperty(userdata, "affiliations")) {
        const affiliations = userdata["affiliations"];
        if (!isJSONArray(affiliations)) {
            throw new Error('User profile "affiliations" is not an array');
        }
        const fixedAffiliations = affiliations
            .filter((affiliation) => {
                // this just to deal with broken affiliations during tesitng.
                return isJSONObject(affiliation);
            })
            .map((affiliation) => {
                if (!isJSONObject(affiliation)) {
                    throw new Error('User profile "affiliation" is not an object');
                }
                // Check fields.
                checkField(affiliation, "title", "string");
                checkField(affiliation, "organization", "string");

                if (!checkField(affiliation, "started", "number")) {
                    const possibleStarted = affiliation["started"];
                    if (typeof possibleStarted === "string") {
                        const started = parseInt(possibleStarted);
                        if (isNaN(started)) {
                            console.warn("Invalid started year in profile", affiliation);
                            // throw new Error('affiliation "started" year is not a number or compatible string');
                            return null;
                        } else {
                            affiliation["started"] = started;
                        }
                    } else {
                        console.error("Invalid started year in profile", affiliation);
                        return null;
                        // throw new Error('affiliation "started" year is not a number or string');
                    }
                }
                if (
                    !(checkField(affiliation, "ended", "number") ||
                        checkField(affiliation, "ended", "undefined") ||
                        (checkField(affiliation, "ended", "object") &&
                            affiliation["ended"] === null))
                ) {
                    const possibleEnded = affiliation["ended"];
                    if (typeof possibleEnded === "string") {
                        if (possibleEnded === "") {
                            // console.warn('dropping affiliation')
                            // delete affiliation['ended'];
                            affiliation["ended"] = null;
                        } else {
                            const ended = parseInt(possibleEnded);
                            if (isNaN(ended)) {
                                affiliation["ended"] = null;
                                // console.error('Invalid ended year in profile', affiliation);
                                // return null;
                                // throw new Error('affiliation "ended" is not a number or compatible string');
                            } else {
                                affiliation["ended"] = ended;
                            }
                        }
                    } else {
                        console.warn(
                            `Invalid ended year in profile, expected number or string, got ${typeof possibleEnded}`,
                            possibleEnded,
                        );
                        return null;
                        // throw new Error('affiliation "ended" year is not a number or string');
                    }
                }
                return affiliation;
            }).filter((affiliation) => {
                return affiliation === null ? false : true;
            });
        userdata.affiliations = fixedAffiliations;
    }

    // if (hasOwnProperty(profile, "preferences"))
    // TODO: more assertions

    return (possibleProfile as unknown) as UserProfile;
}

function checkField(obj: JSONObject, name: string, type: string) {
    const value = obj[name];
    if (typeof value !== type) {
        return false;
    }
    return true;
}




// TODO: Yikes, this should actually be called fixProfile!
function validateProfile(possibleProfile: unknown): asserts possibleProfile is UserProfile {
    if (!isJSONObject(possibleProfile)) {
        throw new Error("User profile is not an object");
    }

    if (!hasOwnProperty(possibleProfile, 'user')) {
        throw new Error('User profile missing "user" property');
    }

    if (!hasOwnProperty(possibleProfile, "profile")) {
        throw new Error('User profile missing "profile" property');
    }

    const profile = possibleProfile.profile;

    if (!isJSONObject(profile)) {
        throw new Error('User profile "profile" is not an object');
    }

    if (!hasOwnProperty(profile, "userdata")) {
        throw new Error('User profile missing "userdata" property');
    }
    const userdata = profile.userdata;
    if (!isJSONObject(userdata)) {
        throw new Error('User profile "userdata" is not an object');
    }

    if (hasOwnProperty(userdata, "affiliations")) {
        const affiliations = userdata["affiliations"];
        if (!isJSONArray(affiliations)) {
            throw new Error('User profile "affiliations" is not an array');
        }
        const fixedAffiliations = affiliations
            .map((affiliation) => {
                if (!isJSONObject(affiliation)) {
                    throw new Error('User profile "affiliation" is not an object');
                }
                // Check fields.
                checkField(affiliation, "title", "string");
                checkField(affiliation, "organization", "string");

                if (!checkField(affiliation, "started", "number")) {
                    const possibleStarted = affiliation["started"];
                    if (typeof possibleStarted === "string") {
                        const started = parseInt(possibleStarted);
                        if (isNaN(started)) {
                            console.error("Invalid started year in profile", affiliation);
                            // throw new Error('affiliation "started" year is not a number or compatible string');
                            return null;
                        } else {
                            affiliation["started"] = started;
                        }
                    } else {
                        console.error("Invalid started year in profile", affiliation);
                        return null;
                        // throw new Error('affiliation "started" year is not a number or string');
                    }
                }
                if (
                    !(checkField(affiliation, "ended", "number") ||
                        (checkField(affiliation, "ended", "object") &&
                            affiliation["ended"] === null))
                ) {
                    const possibleEnded = affiliation["ended"];
                    if (typeof possibleEnded === "string") {
                        if (possibleEnded === "") {
                            // console.warn('dropping affiliation')
                            // delete affiliation['ended'];
                            affiliation["ended"] = null;
                        } else {
                            const ended = parseInt(possibleEnded);
                            if (isNaN(ended)) {
                                affiliation["ended"] = null;
                                // console.error('Invalid ended year in profile', affiliation);
                                // return null;
                                // throw new Error('affiliation "ended" is not a number or compatible string');
                            } else {
                                affiliation["ended"] = ended;
                            }
                        }
                    } else {
                        console.warn(
                            `Invalid ended year in profile, expected number or string, got ${typeof possibleEnded}`,
                            possibleEnded,
                        );
                        return null;
                        // throw new Error('affiliation "ended" year is not a number or string');
                    }
                }
                return affiliation;
            }).filter((affiliation) => {
                return affiliation === null ? false : true;
            });
        userdata.affiliations = fixedAffiliations;
    }

    // if (hasOwnProperty(profile, "preferences"))
    // TODO: more assertions

    // return (possibleProfile as unknown) as UserProfile;
}

/**
 * Return profile data
 * @param id profile id
 * @param token KBase session cookie
 * @param baseUrl hostname
 */
export async function fetchProfileAPI(username: string, token: string, baseURL: string): Promise<UserProfile> {
    const bffServiceUrl = await getBFFServiceUrl(token, baseURL);
    const url = bffServiceUrl + '/fetchUserProfile/' + username;
    const response = await fetch(url, {
        method: 'GET'
    });
    if (response.status === 200) {
        try {
            const possibleProfile = await response.json();
            const cleanedProfile = convertNumberLong(possibleProfile);
            validateProfile(cleanedProfile);
            console.log('converted?', possibleProfile, cleanedProfile);
            return possibleProfile;
        } catch (err) {
            console.error('profile fetch failed', err);
            throw new Error(`Error parsing profile response to json: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    } else {
        throw new Error(`Error fetching user profile: ${response.statusText}`);
    }
}

export async function fetchProfileAPI2(username: string, token: string, url: string): Promise<UserProfile> {
    const client = new UserProfileClient({ url, timeout: SERVICE_CALL_TIMEOUT, token });
    const [profile] = await client.get_user_profile([username]);
    return fixProfile(profile);
    // const bffServiceUrl = await getBFFServiceUrl(token, baseURL);
    // const url = bffServiceUrl + '/fetchUserProfile/' + username;
    // const response = await fetch(url, {
    //     method: 'GET'
    // });
    // if (response.status === 200) {
    //     try {
    //         const possibleProfile = await response.json();
    //         validateProfile(possibleProfile);
    //         return possibleProfile;
    //     } catch (err) {
    //         console.error('profile fetch failed', err);
    //         throw new Error(`Error parsing profile response to json: ${err instanceof Error ? err.message : 'Unknown error'}`);
    //     }
    // } else {
    //     throw new Error(`Error fetching user profile: ${response.statusText}`);
    // }
}

export interface RPC11<T> {
    version: '1.1'
    method: string
    id: string
    params: Array<T>
}

export interface UpdateProfileParams {
    profile: UserProfileUpdate
}

/**
 * update profile 
 * method 'UserProfile.update_user_profile' takes top level key of profile object. 
 * @param token 
 * @param baseURL 
 * @param userdata 
 * @param user
 */
export async function updateProfileAPI(token: string, url: string, profile: UserProfileUpdate): Promise<[number, string]> {
    const rpc: RPC11<UpdateProfileParams> = {
        version: '1.1',
        method: 'UserProfile.update_user_profile',
        id: "123",
        params: [{ profile: profile }]
    };
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            Authorization: token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rpc)
    });
    if (response.status === 200) {
        return [response.status, ''];
    } else {
        const responseJSON = await response.json();
        return [
            response.status,
            responseJSON.error.message
        ];
    }
}

/**
 * Return list of narratives
 * @param param shared/mine/public
 * @param token kbase session cookie
 */
export async function fetchNarrativesAPI(param: string, token: string, baseURL: string) {
    const bffServiceUrl = await getBFFServiceUrl(token, baseURL);
    const url = bffServiceUrl + '/narrative_list/' + param;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: token
        }
    });
    if (response.status === 500) {
        console.error('Fetch Narratives 500 response:', response);
        return [response.status, response.statusText];
    }
    try {
        const narratives = await response.json();
        return narratives;
    } catch (err) {
        console.error('fetch narratives failed', response);
        return [response.status, response.statusText];
    }
}

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
    }
}

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
    }
    try {
        const { result: [users] } = await response.json();
        // if you try to: return response.json, it will get error below
        // Unhandled Rejection (TypeError): Failed to execute 'json' on 'Response': body stream is locked
        // but assigning it to a variable somehow magically works.
        return [response.status, users];
    } catch (err) {
        console.error('fetch search users failed', response);
        return [response.status, response.statusText];
    }
}
