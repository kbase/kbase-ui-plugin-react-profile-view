import { Alert, Empty, Select } from 'antd';
import React from 'react';
import { UserProfileUser, filteredUserAPI } from '../../util/API';
import { containsScriptTag } from '../../util/utils';

interface SearchUsersState {
    searchText: string;
    foundUsers: Array<UserProfileUser>;
    status: SearchUsersStatus;
    message?: string
    // mouseLeave: boolean;
}

export interface OptionItem {
    value: string;
    label: string;
    disabled?: boolean
}

interface SearchUsersProps {
    token: string;
    url: string;
}

export type SearchUsersStatus = "none" | "searching" | "found" | "needmore" | "error";

const MINIMUM_SEARCH_CHARS = 3;

/**
 * View component with user search feature.
 * @param props
 */
class SearchUsers extends React.Component<SearchUsersProps, SearchUsersState> {
    constructor(props: SearchUsersProps) {
        super(props);
        this.state = {
            searchText: '',
            status: 'none',
            foundUsers: [],
            // mouseLeave: false
        };
    }
    /**
     * when search value is more than 2 charactors, 
     * make API call and returns filtered list of users 
     * 
     * @param value 
     */
    async onSearchHandler(value: string) {
        if (value.length === 0) {
            this.setState({ status: 'found', searchText: value, foundUsers: [] });
        } else if (value.length >= MINIMUM_SEARCH_CHARS) {
            if (containsScriptTag(value)) {
                this.setState({ status: 'error', searchText: value, message: 'Search text may not contain the "script" tag' })
                return;
            }
            this.setState({ status: 'searching', searchText: value, foundUsers: this.state.foundUsers })
            const [status, result] = await filteredUserAPI(value, this.props.token, this.props.url);
            if (status === 200) {
                this.setState({ status: 'found', searchText: value, foundUsers: result });
            } else {
                // TODO: make a real error state in this control
                // this just hacks the error response into the user list!
                this.setState({ status: 'error', searchText: value, message: result });
            }
        } else {
            this.setState({ status: 'needmore', searchText: value, foundUsers: [] })
        }

    }

    onChangeHandler(value: string): void {
        const url = `/#user/${value}`;
        window.open(url, '_blank');
    }

    render() {
        const foundUsersToOptions = (): Array<OptionItem> => {
            return this.state.foundUsers.map(({ username, realname }) => {
                return {
                    value: username,
                    label: `${realname} (${username})`
                };
            });
        }
        const options: Array<OptionItem> = ((): Array<OptionItem> => {
            switch (this.state.status) {
                case 'none': return [];
                case 'searching': return foundUsersToOptions();
                case 'found': return foundUsersToOptions();
                case 'needmore': return [];
                case 'error': return [];
            }
        })();

        const notFoundContent = (() => {
            switch (this.state.status) {
                case 'needmore':
                    return <Alert type="warning" message={`Enter ${MINIMUM_SEARCH_CHARS} or more characters`} />
                case 'error': return <Alert type="error" message={this.state.message} />
                default:
                    if (this.state.foundUsers.length === 0) {
                        if (this.state.searchText.length === 0) {
                            return <Alert type="info" message={`Search for a user`} />
                        }
                        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`Nobody found for "${this.state.searchText}"`} />
                    }
            }
        })();

        return (
            <Select<string, OptionItem>
                style={{ width: 250 }}
                allowClear
                showSearch
                filterOption={false}
                placeholder={`Enter ${MINIMUM_SEARCH_CHARS} or more characters`}
                showArrow={false}
                onSearch={this.onSearchHandler.bind(this)}
                onChange={this.onChangeHandler.bind(this)}
                notFoundContent={notFoundContent}
                options={options}
            />
        );
    }
}

export default SearchUsers;
