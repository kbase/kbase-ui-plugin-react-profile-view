/**
 *  Narrative.tsx is a view component
 *
 */
import { Empty, Popover, Table } from 'antd';
import React from 'react';
import { NarrativeData } from '../../redux/interfaces'; //interface
import { dateDisplay } from '../../util/dateDisplay'; // date format

import './Narratives.css';

export interface Props {
    narratives: Array<NarrativeData>;
    loading: boolean;
    isOwner: boolean;
}


/**
 * Returns a component with list of narratives in a table.
 * @param props
 */
export default class Narratives extends React.Component<Props> {
    render() {
        let message: string;
        let emptyText: JSX.Element;
        if (this.props.isOwner) {
            message = 'This table shows all of your narratives.';
            emptyText = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no Narratives" />
        } else {
            message = 'This table shows all Narratives owned by this user which are also accessible to you.';
            emptyText = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You do not have access to any Narratives owned by this user" />
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
                    locale={{ emptyText }}
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
                        render={(last_saved: number) => {
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
