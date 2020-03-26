import React from 'react';
import { Affiliation } from '../../../../redux/interfaces';
import AffiliationForm from './AffiliationForm';
import { Button, Icon } from 'antd';
import './AffiliationEditor.css';

export interface Props {
    affiliation: Affiliation;
    save: (affiliation: Affiliation) => void;
    deleteAffiliation: () => void;
};

interface State {
};

export default class AffiliationEditor extends React.Component<Props, State> {
    render() {
        return <div className="AffiliationEditor-row">
            <div className="AffiliationEditor-form-col">
                <AffiliationForm
                    affiliation={this.props.affiliation}
                    // canSave={this.canSave.bind(this)}
                    save={this.props.save} />
            </div>
            <div className="AffiliationEditor-delete-col">
                <Button
                    type="link"
                    onClick={() => this.props.deleteAffiliation()}>
                    <Icon
                        type="delete"
                    />
                </Button>
            </div>
        </div>;
    }
}