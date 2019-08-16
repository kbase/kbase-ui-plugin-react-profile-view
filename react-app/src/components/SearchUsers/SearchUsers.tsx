import React from 'react';
import { Select } from 'antd';
import { filteredUserAPI } from '../../util/API';
import { FilteredUser } from '../../redux/interfaces';
const { Option } = Select;


interface State {
    data: Array<FilteredUser>;
    mouseLeave: boolean;
}

interface Props {
    token: string;
    baseURL: string;
}

interface Response {
    version: string;
    result: Array<any>;
}

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
    }

    onSearchHandler(value: string): void {
        if (value.length > 2 && this.state.mouseLeave !== true) {
            filteredUserAPI(value, this.props.token, this.props.baseURL).then((response: Response) => {
                if (typeof response !== 'undefined') {
                    this.setState({ data: response['result'][0] });
                } else {
                    this.setState({
                        data: [{ username: 'error', realname: 'Something went wrong. Try again later.' }]
                    });
                }
            });
        } else {
            return;
        }
    }
    onMouseLeaveHandler(): void {
        this.setState({ mouseLeave: true });
    }
    onMouseEnterHandler(): void {
        this.setState({ mouseLeave: false });
    }
    onChangeHandler(value: string): void {
        if (value !== 'error' && typeof value !== 'undefined') {
            let url = '/#user/' + value;
            window.open(url, '_blank');
        }
    }

    render() {
        let data = this.state.data;
        return (
            <Select
                mode="single"
                style={{ width: 300 }}
                allowClear
                showSearch
                placeholder="enter more than 3 characters"
                showArrow={false}
                onSearch={this.onSearchHandler}
                onChange={this.onChangeHandler}
                onMouseLeave={this.onMouseLeaveHandler}
                onMouseEnter={this.onMouseEnterHandler}
                optionFilterProp="children"
                filterOption={(inputValue, option) => {
                    return true;
                }}
            >
                {data.map((item) => {
                    return (
                        <Option key={item['username']}>
                            {item['realname']} ({item['username']})
                        </Option>
                    );
                })}
            </Select>
        );
    }
}

export default SearchUsers;
