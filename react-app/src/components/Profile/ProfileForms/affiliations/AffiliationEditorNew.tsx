import React from 'react';
import { Affiliation } from '../../../../redux/interfaces';
import AffiliationForm from './AffiliationForm';
import './AffiliationEditorNew.css';

export interface Props {
    save: (affiliation: Affiliation) => void;
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
        this.props.save(affiliation);
    }
    // canSave(isSavable: boolean) {
    //     // console.log('can save?', isSavable);
    //     this.setState({
    //         canSave: isSavable
    //     });
    // }
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
                    // canSave={this.canSave.bind(this)}
                    save={this.save.bind(this)} />
            </div>
            <div className="AffiliationEditorNew-control-col"></div>
        </div>;
    }
}