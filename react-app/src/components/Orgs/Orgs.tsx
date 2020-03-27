import React from 'react';
import { Empty } from 'antd';
import { OrgProp } from '../../redux/interfaces';


interface Props {
    orgList: Array<OrgProp>;
};

/**
 * render org component 
 * loading is false when fetch organization completes and returns response. 
 * @param props 
 */
function Orgs(props: Props) {
    let orgList = props.orgList;

    if (props.orgList.length === 0) {
        return (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No Organizations" />
        );
    } else {
        return (
            <table className="LayoutTable">
                <tbody>
                    {orgList.map((org, index) => {
                        const logo = org.logoURL ?
                            <img src={org.logoURL} style={{ height: '30px' }} alt={`Logo for org ${org.name}`} /> : undefined;

                        return <tr key={index}>
                            <td>{logo}</td>
                            <td>
                                <a href={org.url} target="_blank" rel="noopener noreferrer">{org.name}</a>
                            </td>
                        </tr>;
                    })}
                </tbody>
            </table>
        );
    };
};

export default Orgs;