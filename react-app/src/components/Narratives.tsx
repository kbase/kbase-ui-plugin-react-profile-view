/**
 *  Narrative.tsx is a view component
 *  Parent componenet - pages/Home.tsx
 *
 */
import React from 'react';
import { dateDisplay } from '../util/dateDisplay'; // date format
import { Table, Popover } from 'antd';
import { Narrative_detail, NarrativeData } from '../pages/Home'; //interface

interface TableData {
    key: string;
    wsID: string;
    name: string;
    last_saved: number;
}

interface Props {
    token: string;
    narratives: Array<NarrativeData>;
    narrativesloaded: Boolean;
}

/**
 * Returns a component with list of narratives in a table.
 * @param props
 */
function Narratives(props: Props) {
    let data: Array<TableData> = [];
    let loading = true;
    if (props.narrativesloaded) {
        loading = false;
    }
    // initialize data for the table to be an empty array.
    const colums = [
        {
            title: 'Title',
            dataIndex: 'name',
            width: 350,
            key: 'wsID',
            render: (text: string, row: TableData) => {
                let url = '/narrative/' + row.wsID;
                return (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {text}
                    </a>
                );
            },
            sorter: (a: TableData, b: TableData) => {
                let nameA = a.name.toUpperCase();
                let nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            }
        },
        {
            title: 'Last Saved',
            dataIndex: 'last_saved',
            width: 190,
            render: (text: string, row: TableData) => {
                let day = dateDisplay(row.last_saved);
                return (
                    <Popover placement="right" content={day[0]}>
                        {day[1]}
                    </Popover>
                );
            },
            sorter: (a: TableData, b: TableData) => {
                let lastSavedA = a.last_saved;
                let lastSavedB = b.last_saved;
                if (lastSavedA < lastSavedB) {
                    return 1;
                }
                if (lastSavedA > lastSavedB) {
                    return -1;
                }
                return 0;
            }
        }
    ];

    for (let i = 0; i < props.narratives.length; i += 1) {
        let narrative = props.narratives[i];
        if (narrative.permission === 'r' || narrative.permission === 'n') {
            if (Object.keys(narrative.users).length <= 0) {
                data.push({
                    key: narrative.wsID,
                    wsID: narrative.wsID,
                    name: narrative.name,
                    last_saved: narrative.last_saved
                });
            } else {
                data.push({
                    key: narrative.wsID,
                    wsID: narrative.wsID,
                    name: narrative.name,
                    last_saved: narrative.last_saved
                });
            }
        } else {
            const narrativeDetail: Narrative_detail = narrative['narrative_detail'];
            let users = '';
            for (let user in narrative.users) {
                if (user !== narrativeDetail.creator) users = users + user + ', ';
            }
            data.push({
                key: narrative.wsID,
                wsID: narrative.wsID,
                name: narrative.name,
                last_saved: narrative.last_saved
            });
        }
    }

    return (
        <Table<TableData>
            style={{ width: '85%', margin: 'auto' }}
            columns={colums}
            dataSource={data}
            loading={loading}
        />
    );
}

export default Narratives;
