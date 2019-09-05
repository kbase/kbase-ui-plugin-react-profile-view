import React from'react';
import {OrgProp} from '../../redux/interfaces';
import { Card } from 'antd';


interface Props {
    orgList: Array<OrgProp>;
}

/**
 * render org component 
 * loading is false when fetch organization completes and returns response. 
 * @param props 
 */
function Orgs(props: Props) {
    console.log(props)
    let orgList = props.orgList;
    return(
            <ul style={{ textAlign: 'left' }}>
                {orgList.map((org, index) => (
                    <li key={index}>
                        <a href={org.url} target="_blank" rel="noopener noreferrer">
                            {org.name}
                        </a>
                    </li>
                ))}
            </ul>
    )
    
}

export default Orgs;