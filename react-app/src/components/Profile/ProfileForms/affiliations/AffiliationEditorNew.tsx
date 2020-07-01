import React from 'react';
import { Affiliation } from '../../../../redux/interfaces';
import AffiliationForm from './AffiliationForm';
import './AffiliationEditorNew.css';
import { Button } from 'antd';
import {
    DeleteOutlined, PlusCircleOutlined
} from '@ant-design/icons';
import ButtonGroup from 'antd/lib/button/button-group';

export interface Props {
    save: (affiliation: Affiliation) => void;
    cancel: () => void;
};

interface State {
    canSave: boolean;
    savableAffiliation: Affiliation | null;
};

export default class AffiliationEditorNew extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            canSave: false,
            savableAffiliation: null
        };
    }

    save(affiliation: Affiliation) {
        this.setState({
            savableAffiliation: affiliation
        });
    }

    doSave() {
        if (this.state.savableAffiliation) {
            this.props.save(this.state.savableAffiliation);
        }
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
                    autoSave={false}
                    save={this.save.bind(this)}
                />
            </div>
            <div className="AffiliationEditorNew-control-col">
                <ButtonGroup>
                    <Button
                        type="link"
                        icon={<PlusCircleOutlined />}
                        onClick={this.doSave.bind(this)}
                    />
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
