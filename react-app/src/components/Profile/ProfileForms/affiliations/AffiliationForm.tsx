import React from 'react';

import { Affiliation } from '../../../../redux/interfaces';
import EndedField from './fields/Ended';
import StartedField from './fields/Started';
import OrganizationField from './fields/Organization';
import TitleField from './fields/Title';

import './AffiliationForm.css';
import { AntDesignValidationStatus } from '../../../../types';

export interface Props {
    affiliation: Affiliation;
    save: (affiliation: Affiliation) => void;
    // canSave: (canSave: boolean) => void;
    autoSave: boolean;
};

interface State {
    dirty: boolean;
    fields: {
        title: {
            value: string,
            status: AntDesignValidationStatus;
        },
        organization: {
            value: string,
            status: AntDesignValidationStatus;
        },
        started: {
            value: number,
            status: AntDesignValidationStatus;
        },
        ended: {
            value: number | null,
            status: AntDesignValidationStatus;
        };
    };
};

export default class AffiliationForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            dirty: false,
            fields: {
                title: {
                    value: this.props.affiliation.title,
                    status: ''
                },
                organization: {
                    value: this.props.affiliation.organization,
                    status: ''
                },
                started: {
                    value: this.props.affiliation.started,
                    status: ''
                },
                ended: {
                    value: this.props.affiliation.ended,
                    status: ''
                }
            }
        };
    };

    commit() {
        const { title, organization, started, ended } = this.state.fields;
        if (title.status === 'success' && organization.status === 'success' && started.status === 'success' && ended.status === 'success') {
            const affiliation = {
                title: title.value,
                organization: organization.value,
                started: started.value,
                ended: ended.value
            };
            this.props.save(affiliation);
            this.setState({ dirty: false });
        } else {
            console.warn('COMMIT - not saving...', this.state.fields);
        }
    }

    componentDidUpdate() {
        if (this.state.dirty) {
            this.commit();
        }
    }

    onCommitEnded(ended: number | null) {
        this.setState({
            dirty: true,
            fields: {
                ...this.state.fields,
                ended: {
                    value: ended,
                    status: 'success'
                }
            }
        });
    }

    onCommitStarted(started: number) {
        this.setState({
            dirty: true,
            fields: {
                ...this.state.fields,
                started: {
                    value: started,
                    status: 'success'
                }
            }
        });
    }

    onCommitOrganization(organization: string) {
        this.setState({
            dirty: true,
            fields: {
                ...this.state.fields,
                organization: {
                    value: organization,
                    status: 'success'
                }
            }
        });
    }

    onCommitTitle(title: string) {
        this.setState({
            dirty: true,
            fields: {
                ...this.state.fields,
                title: {
                    value: title,
                    status: 'success'
                }
            }
        });
    }

    onStatusTitle(status: AntDesignValidationStatus) {
        const fields = this.state.fields;
        fields.title.status = status;
        this.setState({
            fields
        });
    }

    onStatusOrganization(status: AntDesignValidationStatus) {
        const fields = this.state.fields;
        fields.organization.status = status;
        this.setState({
            fields
        });
    }

    onStatusStarted(status: AntDesignValidationStatus) {
        const fields = this.state.fields;
        fields.started.status = status;
        this.setState({
            fields
        });
    }

    onStatusEnded(status: AntDesignValidationStatus) {
        const fields = this.state.fields;
        fields.ended.status = status;
        this.setState({
            fields
        });
    }
    /**
     * builds affiliation card
     */
    render() {
        return (
            <form
                className=''
                autoComplete="on">
                <div className='AffiliationsRow'>
                    {/* Job title / role */}
                    <div className='AffiliationsCol'>
                        <TitleField
                            value={this.props.affiliation.title}
                            commit={this.onCommitTitle.bind(this)}
                            status={this.onStatusTitle.bind(this)} />
                    </div>
                    {/* Organization */}
                    <div className='AffiliationsCol'>
                        <OrganizationField
                            value={this.props.affiliation.organization}
                            commit={this.onCommitOrganization.bind(this)}
                            status={this.onStatusOrganization.bind(this)} />
                    </div>
                    {/* Started year */}
                    <div className='AffiliationsCol'>
                        <StartedField
                            value={this.props.affiliation.started}
                            ended={this.props.affiliation.ended}
                            commit={this.onCommitStarted.bind(this)}
                            status={this.onStatusStarted.bind(this)} />
                    </div>
                    {/* Ended year */}
                    <div className='AffiliationsCol'>
                        <EndedField
                            value={this.props.affiliation.ended}
                            started={this.props.affiliation.started}
                            commit={this.onCommitEnded.bind(this)}
                            status={this.onStatusEnded.bind(this)} />
                    </div>
                </div>
            </form>
        );
    }
}
