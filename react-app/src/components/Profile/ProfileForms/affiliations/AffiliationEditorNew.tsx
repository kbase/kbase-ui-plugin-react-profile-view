import React from 'react';
import { Button } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import {
    DeleteOutlined
} from '@ant-design/icons';

import { Affiliation } from '../../../../redux/interfaces';
import AffiliationForm from './AffiliationForm';
import './AffiliationEditorNew.css';

export interface Props {
    save: (affiliation: Affiliation) => void;
    cancel: () => void;
};

interface State {
};

export default class AffiliationEditorNew extends React.Component<Props, State> {
    save(affiliation: Affiliation) {
        this.props.save(affiliation);
    }

    render() {
        const affiliation: Affiliation = {
            title: '',
            organization: '',
            started: new Date().getFullYear(),
            ended: null
        };
        return <div className="AffiliationEditorNew-row">
            <div className="AffiliationEditorNew-form-col">
                <AffiliationForm affiliation={affiliation}
                    save={this.save.bind(this)}
                />
            </div>
            <div className="AffiliationEditorNew-control-col">
                <ButtonGroup>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={this.props.cancel}
                    />
                </ButtonGroup>
            </div>
        </div>;
    }
}
