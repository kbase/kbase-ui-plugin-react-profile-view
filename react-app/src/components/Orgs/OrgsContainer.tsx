import React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';


import { OrgProp, StoreState } from '../../redux/interfaces';
import Orgs from  './Orgs';


interface Props {
    orgList: Array<OrgProp>;
}


interface DispatchProps {
    loadOrgs: (profileID: String) => void;
}

function mapStateToProps(state: StoreState):Props {
    let array =  {
        orgList:
        [
            {
                name: 'hahahah',
                url: 'hehehehe'
            }
        ]
    }

    return array
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        loadOrgs: (profileID: string) => {
            return dispatch(loadOrgs(profileID) as any);
        }
    }
    
};

export default connect<Props, DispatchProps, {}, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Orgs);