import React from'react';
import { Empty } from 'antd';
import {OrgProp} from '../../redux/interfaces';


interface Props {
    orgList: Array<OrgProp>;
}

/**
 * render org component 
 * loading is false when fetch organization completes and returns response. 
 * @param props 
 */
function Orgs(props: Props) {
    let orgList = props.orgList;
    
    if(props.orgList.length === 0) {
        return (
            <div><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
        )
    } else {

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
        );
    };
    
};

export default Orgs;