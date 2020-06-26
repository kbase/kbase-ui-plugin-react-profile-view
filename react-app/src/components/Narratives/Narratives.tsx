/**
 *  Narrative.tsx is a view component
 *
 */
import React from 'react';
import { dateDisplay } from '../../util/dateDisplay'; // date format
import { Table, Popover } from 'antd';
import { NarrativeData } from '../../redux/interfaces'; //interface

import './Narratives.css';

interface Props {
    narratives: Array<NarrativeData>;
    loading: boolean;
    isOwner: boolean;
}

interface State {
}

/**
 * Returns a component with list of narratives in a table.
 * @param props
 */
export default class Narratives extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        let message: string;
        if (this.props.isOwner) {
            message = 'This table shows all of your narratives.';
        } else {
            message = 'This table shows all Narratives owned by this user which are also accessible to you.';
        }
        return <div className="Narratives">
            <p>{message}</p>
            <div className="Col">
                <Table
                    size="small"
                    className="AntTable-FullHeight"
                    dataSource={this.props.narratives}
                    loading={this.props.loading}
                    pagination={false}
                    scroll={{ y: '100%' }}
                    rowKey="wsID"
                >
                    <Table.Column
                        title="Title"
                        dataIndex="name"
                        key="wsID"
                        render={(name: string, row: NarrativeData) => {
                            return <a href={`/narrative/${row.wsID}`} target="_blank" rel="noopener noreferrer">
                                {name}
                            </a>;
                        }}
                        sorter={(a: NarrativeData, b: NarrativeData) => {
                            return a.name.localeCompare(b.name);
                        }}
                    />
                    <Table.Column
                        title="Last Saved"
                        dataIndex="last_saved"
                        width={190}
                        render={(last_saved: number, row: NarrativeData) => {
                            const day = dateDisplay(last_saved);
                            return <Popover placement="right" content={day[0]}>
                                <span>{day[1]}</span>
                            </Popover>;
                        }}
                        defaultSortOrder={"descend"}
                        sorter={(a: NarrativeData, b: NarrativeData) => {
                            return a.last_saved - b.last_saved;
                        }}
                    />
                </Table>
            </div>
        </div>;
    }
}
