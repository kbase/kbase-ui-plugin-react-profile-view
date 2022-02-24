import React from 'react';
import { Select } from 'antd';
import { filteredUserAPI } from '../../util/API';
import { UsernameRealname } from '../../redux/interfaces';

const { Option } = Select;


interface State {
    data: Array<UsernameRealname>;
    mouseLeave: boolean;
};

interface Props {
    token: string;
    url: string;
};

interface Response {
    version: string;
    result: Array<any>;
};

/**
 * View component with user search feature.
 * @param props
 */
class SearchUsers extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
            mouseLeave: false
        };
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSearchHandler = this.onSearchHandler.bind(this);
        this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
        this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
    };
    /**
     * when search value is more than 2 charactors, 
     * make API call and returns filtered list of users 
     * 
     * @param value 
     */
    onSearchHandler(value: string): void {
        if (value.length > 2 && this.state.mouseLeave !== true) {
            filteredUserAPI(value, this.props.token, this.props.url).then((response: Response) => {
                if (typeof response !== 'undefined' && !Array.isArray(response)) {
                    this.setState({ data: response['result'][0] });
                } else if (Array.isArray(response)) {
                    // when status and status text are returned
                    this.setState({
                        data: [{ username: response[0], realname: response[1] }]
                    });
                } else {
                    this.setState({
                        data: [{ username: 'error', realname: 'Something went wrong. Try again later.' }]
                    });
                };
            });
        } else {
            return;
        };
    };

    onMouseLeaveHandler(): void {
        this.setState({ mouseLeave: true });
    };

    onMouseEnterHandler(): void {
        this.setState({ mouseLeave: false });
    };

    onChangeHandler(value: string): void {
        if (value !== 'error' && typeof value !== 'undefined' && isNaN(parseInt(value))) {
            let url = '/#user/' + value;
            window.open(url, '_blank');
        };
    };

    render() {
        let data = this.state.data;
        const options = this.state.data.map(({ username, realname }) => {
            return {
                value: username,
                label: `${realname} (${username})`
            };
        });
        return (
            <Select
                style={{ width: 250 }}
                allowClear
                showSearch
                placeholder='enter 3 or more characters'
                showArrow={false}
                onInputKeyDown={(e) => { e.stopPropagation(); }} // this is required so that tabs don't respond to key board events
                onSearch={this.onSearchHandler}
                onChange={this.onChangeHandler}
                onMouseLeave={this.onMouseLeaveHandler}
                onMouseEnter={this.onMouseEnterHandler}
                optionFilterProp='children'
                filterOption={(inputValue, option) => {
                    return true;
                }}
                options={options}
            />
        );
    };
};

export default SearchUsers;
