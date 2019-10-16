
/**
 * 
 * NOT IN USE
 *  Narrative.tsx is a view component
 *  Parent componenet - pages/Home.tsx
 *  
 */
import React from 'react';
import { Table } from 'antd';
import { NarrativeData } from '../../redux/interfaces';
interface TableData {
    name: string;
    sharedBy: string;
    sharedWith: string;
    last_saved: number;
}


interface Props {
    loggedInUser: string;
    narratives: Array<NarrativeData>;
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
            title: 'Last Saved', dataIndex: 'last_saved', width: 190,
            sorter: (a: TableData, b: TableData) => {
                let createdA = a.last_saved;
                let createdB = b.last_saved;
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
                data.push({ 'name': narrative.name, 'sharedBy': '', 'sharedWith': '', 'last_saved': narrative.last_saved });
            } else {
                data.push({ 'name': narrative.name, 'sharedBy': narrative.narrative_detail.creator, 'sharedWith': Object.keys(narrative.users)[0], 'last_saved': narrative.last_saved, });
            }
        } else {
            let users = '';
            for (let user in narrative.users) {
                if (user !== narrative.narrative_detail.creator)
                    users = users + user + ', ';
            }
            data.push({ 'name': narrative.name, 'sharedBy': narrative.narrative_detail.creator, 'sharedWith': users, 'last_saved': narrative.last_saved });
        }
    }

    return (
        <Table<TableData> style={{ width: '85%', margin: 'auto' }} columns={colums} dataSource={data} />
    )
}

export default Narratives;