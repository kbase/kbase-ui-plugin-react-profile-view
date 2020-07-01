import React from 'react';
import { Affiliation } from '../../../../redux/interfaces';
import AffiliationForm from './AffiliationForm';
import { Button } from 'antd';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import './AffiliationEditor.css';
import ButtonGroup from 'antd/lib/button/button-group';

export interface Props {
    affiliation: Affiliation;
    save: (affiliation: Affiliation) => void;
    deleteAffiliation: () => void;
};

interface State {
    affiliationToSave: Affiliation;
};

export default class AffiliationEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            affiliationToSave: props.affiliation
        };
    }
    render() {
        return <div className="AffiliationEditor-row">
            <div className="AffiliationEditor-form-col">
                <AffiliationForm
                    affiliation={this.props.affiliation}
                    // canSave={this.canSave.bind(this)}
                    save={this.props.save}
                    autoSave={true}
                />
            </div>
            <div className="AffiliationEditor-delete-col">
                <ButtonGroup>
                    <Button
                        type="link"
                        icon={<SaveOutlined />}
                        style={{ visibility: 'hidden' }}
                    // onClick={() => this.props.save}
                    />
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