import React from 'react';
import ButtonGroup from 'antd/lib/button/button-group';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { Affiliation } from '../../../../redux/interfaces';
import AffiliationForm from './AffiliationForm';
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
                    save={this.props.save}
                />
            </div>
            <div className="AffiliationEditor-delete-col">
                <ButtonGroup>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => this.props.deleteAffiliation()} />
                </ButtonGroup>
            </div>
        </div>;
    }
}