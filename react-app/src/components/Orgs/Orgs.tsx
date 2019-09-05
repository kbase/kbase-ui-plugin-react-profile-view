import React from'react';
import {OrgProp} from '../../redux/interfaces';
import { Card } from 'antd';


interface Props {
    orgList: Array<OrgProp>;
    loading: boolean;
}

/**
 * render org component 
 * loading is false when fetch organization completes and returns response. 
 * @param props 
 */
function Orgs(props: Props) {
    console.log(props)
    let orgList = props.orgList;
    let loading = props.loading;
    return(
        <Card className="card-with-height" loading={loading} style={{ margin: '8px 0px' }} title="Organizations">
            <ul style={{ textAlign: 'left' }}>
                {orgList.map((org, index) => (
                    <li key={index}>
                        <a href={org.url} target="_blank" rel="noopener noreferrer">
                            {org.name}
                        </a>
                    </li>
                ))}
            </ul>
        </Card>
    )
    
}

export default Orgs;