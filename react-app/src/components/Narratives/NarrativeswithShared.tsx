
/**
 *  Narrative.tsx is a view component
 *  Parent componenet - pages/Home.tsx
 *  
 */
import React from 'react';
import { Table } from 'antd';

interface TableData {
    name: string;
    sharedBy: string;
    sharedWith: string;
    created: string;
    last_saved: string;
}

interface narrative_detail {
    creator: string;
}

interface narrativeData {
    wsID: string;
    permission: string;
    name: string;
    last_saved: string;
    users: object;
    narrative_detail: narrative_detail;
}

interface Props {
    loggedInUser: string;
    narratives: Array<narrativeData>;
}

/**
 * Returns view components that lists shared narratives
 * @param props 
 */
const Narratives = (props: Props) => {
    const colums = [
        {
            title: 'Title', dataIndex: 'name', width: 350,
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
        { title: 'Shared by', dataIndex: 'narrative_detail.creator' },
        { title: 'Shared with', dataIndex: 'users' },
        {
            title: 'Created', dataIndex: 'last_saved', width: 190,
            sorter: (a: TableData, b: TableData) => {
                let createdA = a.last_saved.toUpperCase();
                let createdB = b.last_saved.toUpperCase();
                if (createdA < createdB) {
                    return -1;
                }
                if (createdA > createdB) {
                    return 1;
                }
                return 0;
            }
        },
        {
            title: 'Last Saved', dataIndex: 'last_saved', width: 190,
            sorter: (a: TableData, b: TableData) => {
                let createdA = a.last_saved.toUpperCase();
                let createdB = b.last_saved.toUpperCase();
                if (createdA < createdB) {
                    return -1;
                }
                if (createdA > createdB) {
                    return 1;
                }
                return 0;
            }
        }
    ];

    let data: Array<TableData> = [];
    for (let i = 0; i < props.narratives.length; i += 1) {
        let narrative = props.narratives[i];
        if (narrative.permission === 'r' || narrative.permission === 'n') {
            if (Object.keys(narrative.users).length <= 0) {
                data.push({ 'name': narrative.name, 'sharedBy': '', 'sharedWith': '', 'created': narrative.last_saved, 'last_saved': narrative.last_saved });
            } else {
                data.push({ 'name': narrative.name, 'sharedBy': narrative.narrative_detail.creator, 'sharedWith': Object.keys(narrative.users)[0], 'created': narrative.last_saved, 'last_saved': narrative.last_saved, });
            }
        } else {
            let users = '';
            for (let user in narrative.users) {
                if (user !== narrative.narrative_detail.creator)
                    users = users + user + ', ';
            }
            data.push({ 'name': narrative.name, 'sharedBy': narrative.narrative_detail.creator, 'sharedWith': users, 'created': narrative.last_saved, 'last_saved': narrative.last_saved });
        }
    }

    return (
        <Table<TableData> style={{ width: '85%', margin: 'auto' }} columns={colums} dataSource={data} />
    )
}

export default Narratives;