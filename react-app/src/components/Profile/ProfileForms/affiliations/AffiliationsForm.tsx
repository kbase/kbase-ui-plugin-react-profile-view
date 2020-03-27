import React from 'react';
import { Affiliation, ProfileUserdata, UserName } from '../../../../redux/interfaces';
import './AffiliationForm.css';
// import AffiliationForm from './AffiliationForm';
// import NewAffiliationForm from './NewAffiliationForm';
import AffiliationEditor from './AffiliationEditor';
import AffiliationEditorNew from './AffiliationEditorNew';
import { Button } from 'antd';

// const { Option } = Select;

// const MIN_AFFILIATION_DATE = 1900;
// const MAX_AFFILIATION_DATE = 2300;


// interface AffiliationValidated {
//     title: string;
//     organization: string;
//     started: number;
//     ended: number | undefined;
//     validatedStatusJobTitle: "" | "error" | "success" | "warning" | "validating" | undefined;
//     validatedStatusOrganization: "" | "error" | "success" | "warning" | "validating" | undefined;
//     validatedStatusStartYear: "" | "error" | "success" | "warning" | "validating" | undefined;
//     validatedStatusEndYear: "" | "error" | "success" | "warning" | "validating" | undefined;
//     helpTextJobTitle: string | undefined;
//     helpTextOrganization: string | undefined;
//     helpTextStartYear: string | undefined;
//     helpTextEndYear: string | undefined;
// };

interface State {
    affiliations: Array<Affiliation>;
    addingNewAffiliation: boolean;
};

interface Props {
    userName: UserName;
    profileUserdata: ProfileUserdata;
    editEnable: boolean;
    affiliations: Array<Affiliation>;
    updateStoreState: (data: ProfileUserdata, userName: UserName) => void;
};

// const formItemLayout = {
//     labelCol: {
//         xs: { span: 24 },
//         sm: { span: 1 },
//     },
//     wrapperCol: {
//         xs: { span: 24 },
//         sm: { span: 23 },
//     },
// };

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
        });

        // TODO: Ugh. Everywhere that this is practiced needs to be refactored.
        // very dangerous in general, but for personal user profiles the concurrency is 
        // essentially 1, but still...
        const profile = this.props.profileUserdata;
        const newProfile: ProfileUserdata = {
            ...profile,
            affiliations
        };
        this.props.updateStoreState(newProfile, this.props.userName);
    }

    doEditEnable() {
        return true;
    }

    doSaveAffiliation(affiliation: Affiliation, index: number) {
        const affiliations = this.state.affiliations;
        affiliations[index] = affiliation;
        affiliations.sort((a, b) => {
            return (a.started - b.started);
        });
        // TODO: Ugh. Everywhere that this is practiced needs to be refactored.
        // very dangerous in general, but for personal user profiles the concurrency is 
        // essentially 1, but still...
        const profile = this.props.profileUserdata;
        const newProfile: ProfileUserdata = {
            ...profile,
            affiliations
        };
        this.props.updateStoreState(newProfile, this.props.userName);
    }

    doSaveNewAffiliation(affiliation: Affiliation) {
        const affiliations = this.state.affiliations;
        // TODO: Ugh. Everywhere that this is practiced needs to be refactored.
        // very dangerous in general, but for personal user profiles the concurrency is 
        // essentially 1, but still...
        const profile = this.props.profileUserdata;
        affiliations.push(affiliation);
        this.setState({
            affiliations,
            addingNewAffiliation: false
        });
        const newProfile: ProfileUserdata = {
            ...profile,
            affiliations
        };
        this.props.updateStoreState(newProfile, this.props.userName);
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
                    <Button type="danger" icon="minus" onClick={this.toggleNewAffiliation.bind(this)}>Cancel</Button>

                    <AffiliationEditorNew
                        save={(affiliation) => { this.doSaveNewAffiliation(affiliation); }}
                    />
                </div>
            );
        } else {
            return <div>
                <Button icon="plus" onClick={this.toggleNewAffiliation.bind(this)}>Add New Affiliation</Button>
            </div>;
        }
    }

    renderHeader() {
        return <div style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid silver' }}>
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
