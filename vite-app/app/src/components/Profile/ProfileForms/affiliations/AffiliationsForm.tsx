import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { Affiliation, ProfileUserdata } from '../../../../redux/interfaces';
import './AffiliationForm.css';
import AffiliationEditor from './AffiliationEditor';
import AffiliationEditorNew from './AffiliationEditorNew';

interface State {
    affiliations: Array<Affiliation>;
    addingNewAffiliation: boolean;
};

interface Props {
    profileUserdata: ProfileUserdata;
    editEnable: boolean;
    affiliations: Array<Affiliation>;
    save: (affiliations: Array<Affiliation>) => void;
};

export default class AffiliationsForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            affiliations: this.props.affiliations,
            addingNewAffiliation: false
        };
    };

    doDeleteAffiliation(index: number) {
        const affiliations = this.state.affiliations;
        affiliations.splice(index, 1);
        this.setState({
            affiliations
        }, () => {
            this.props.save(this.state.affiliations);
        });
    }

    doEditEnable() {
        return true;
    }

    doSaveAffiliation(affiliation: Affiliation, index: number) {
        const affiliations = this.state.affiliations.slice(0);
        affiliations[index] = affiliation;
        affiliations.sort((a, b) => {
            return (a.started - b.started);
        });
        this.setState({
            affiliations
        }, () => {
            this.props.save(this.state.affiliations);
        });
    }

    doSaveNewAffiliation(affiliation: Affiliation) {
        const affiliations = this.state.affiliations;
        affiliations.push(affiliation);
        this.setState({
            affiliations,
            addingNewAffiliation: false
        }, () => {
            this.props.save(this.state.affiliations);
        });
    }

    renderAffiliations() {
        return (
            <div id='affiliations'>
                {this.props.affiliations.map((affiliation, index) => {
                    return <div key={String(index)}>
                        <AffiliationEditor
                            affiliation={affiliation}
                            deleteAffiliation={() => { this.doDeleteAffiliation(index); }}
                            save={(affiliation) => { this.doSaveAffiliation(affiliation, index); }}
                        />
                    </div>;
                })}
            </div>
        );
    }

    toggleNewAffiliation() {
        this.setState({
            addingNewAffiliation: !this.state.addingNewAffiliation
        });
    }

    renderNewAffiliationForm() {
        if (this.state.addingNewAffiliation) {
            return (
                <div>
                    <AffiliationEditorNew
                        save={this.doSaveNewAffiliation.bind(this)}
                        cancel={this.toggleNewAffiliation.bind(this)}
                    />
                </div>
            );
        } else {
            return <div>
                <Button
                    icon={<PlusOutlined />}
                    onClick={this.toggleNewAffiliation.bind(this)}>
                    Add New Affiliation
                </Button>
            </div>;
        }
    }

    renderHeader() {
        return <div style={{
            display: 'flex',
            flexDirection: 'row',
            borderBottom: '1px solid silver',
            marginBottom: '4px'
        }}>
            <div className="AffiliationsRow" style={{ flex: '1 1 0px' }}>
                <div className="AffiliationsCol">Position</div>
                <div className="AffiliationsCol">Organization</div>
                <div className="AffiliationsCol">Started</div>
                <div className="AffiliationsCol">Ended</div>
            </div>
            <div style={{ flex: '0 0 3em' }}></div>
        </div>;
    }

    render() {
        return <div>
            {this.renderHeader()}
            {this.renderAffiliations()}
            {this.renderNewAffiliationForm()}
        </div>;
    };
};
