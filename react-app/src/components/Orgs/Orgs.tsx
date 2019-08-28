import React from'react';
import {OrgProp} from '../../redux/interfaces';


import { Card } from 'antd';
const { Meta } = Card;



interface Props {
    orgList: Array<OrgProp>;
}

function Orgs(props: Props) {
    let orgList = props.orgList;
    if(props){
        return(
            <Card className="card-with-height" style={{ margin: '8px 0px' }} title="Organizations">
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
    } else {
        return (<Card className="card-with-height" loading={true} style={{ margin: '8px 0px' }} title="Organizations"></Card>)
    }
}

export default Orgs;