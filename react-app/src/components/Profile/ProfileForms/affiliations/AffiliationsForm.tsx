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

        console.log('AffiliationsForm', this.props.affiliations);

        // this.showEditButtons = this.showEditButtons.bind(this);
        // this.tooltipVisibility = this.tooltipVisibility.bind(this);
        // this.requiredNotificationControl = this.requiredNotificationControl.bind(this);
        // this.saveDisabled = this.saveDisabled.bind(this);
        // this.validateInput = this.validateInput.bind(this);
        // this.saveLocalState = this.saveLocalState.bind(this);
        // this.addAffiliation = this.addAffiliation.bind(this);
        // this.deleteAffiliation = this.deleteAffiliation.bind(this);
        // this.affiliationJobTitleOnChange = this.affiliationJobTitleOnChange.bind(this);
        // this.institutionOnSearch = this.institutionOnSearch.bind(this);
        // this.affiliations = this.affiliations.bind(this);
    };

    // componentDidMount() {
    //     // let newAffiliations: Array<AffiliationValidated> = [];
    //     // for (let i = 0; i < this.props.affiliations.length; i += 1) {
    //     //     let obj = {
    //     //         title: this.props.affiliations[i].title,
    //     //         organization: this.props.affiliations[i].organization,
    //     //         started: this.props.affiliations[i].started,
    //     //         ended: this.props.affiliations[i].ended || undefined,
    //     //         validatedStatusJobTitle: undefined,
    //     //         validatedStatusOrganization: undefined,
    //     //         validatedStatusStartYear: undefined,
    //     //         validatedStatusEndYear: undefined,
    //     //         helpTextJobTitle: undefined,
    //     //         helpTextOrganization: undefined,
    //     //         helpTextStartYear: undefined,
    //     //         helpTextEndYear: undefined,
    //     //     };
    //     //     newAffiliations.push(obj);
    //     // };
    //     // this.setState({ affiliations: newAffiliations });
    //     // this.setState({ affiliations: this.props.affiliations });
    // };

    // // show/hide edit/save buttons
    // showEditButtons() {
    //     if (this.props.editEnable === true) {
    //         return 'unset';
    //     } else {
    //         return 'none';
    //     };
    // };

    // // show/hide required notification 
    // requiredNotificationControl() {
    //     if (this.props.editEnable) {
    //         return true;
    //     } else {
    //         return false;
    //     };
    // };
    // // disables save button while validated states is error.
    // saveDisabled() {
    //     for (let i = 0; i < this.state.affiliations.length; i += 1) {
    //         let affiliationObj = this.state.affiliations[i];
    //         if (Object.values(affiliationObj).includes('error')) {
    //             return true;
    //         };
    //     };
    // };


    // event handlers//    
    /** 
    * Validate value against 
    *  - max and min length
    *  - if it's required field
    *  - type 
    * and set state per validation result.
    * @param inputValue 
    */
    // validateInput(inputValue: string, index: number, property: string, helperTextProp: string, type: string, max: number, min?: number) {

    //     // it has to be set to "any" in order to use generic property name    
    //     let affiliationArray: any = this.state.affiliations;
    //     // When type is number, then check if it's a number first
    //     if (type === "number" && (isNaN(parseInt(inputValue, 10)) || parseInt(inputValue, 10) < 0)) {
    //         affiliationArray[index][property] = "error";
    //         affiliationArray[index][helperTextProp] = 'Expecting positive numbers';
    //         this.setState({ affiliations: affiliationArray });
    //         return;
    //     };

    //     // check against min and max length
    //     if (typeof min === 'undefined') {
    //         min = 2;
    //     };
    //     if (inputValue.length <= max && inputValue.length >= min) {

    //         affiliationArray[index][property] = 'success';
    //         affiliationArray[index][helperTextProp] = undefined;
    //         this.setState({ affiliations: affiliationArray });

    //     } else if (inputValue.length < min) {

    //         affiliationArray[index][property] = 'error';
    //         affiliationArray[index][helperTextProp] = 'input must be at least ' + min + ' characters';
    //         this.setState({ affiliations: affiliationArray });

    //     } else if (inputValue.length > max) {

    //         // this shouldn't happen since input field max length is set
    //         affiliationArray[index][property] = 'error';
    //         affiliationArray[index][helperTextProp] = 'input must be less than ' + max + ' characters';
    //         this.setState({ affiliations: affiliationArray });
    //     };
    // };

    // /**
    // * Save/update input value to state
    // * @param event 
    // */
    // saveLocalState(value: string, index: number, property: string) {
    //     let affiliations: any = this.state.affiliations;
    //     affiliations[index][property] = value.trim();
    //     this.setState({ affiliations: affiliations });
    // };

    // /**
    //  * Add a new affiliation object to arrlication array
    //  * @param event 
    //  */
    // addAffiliation(event: any) {
    //     let newAffiliation: Array<AffiliationValidated> = [{
    //         title: '',
    //         organization: '',
    //         started: undefined,
    //         ended: undefined,
    //         validatedStatusJobTitle: 'error',
    //         validatedStatusOrganization: 'error',
    //         validatedStatusStartYear: 'error',
    //         validatedStatusEndYear: undefined,
    //         helpTextJobTitle: undefined,
    //         helpTextOrganization: undefined,
    //         helpTextStartYear: undefined,
    //         helpTextEndYear: undefined,
    //     }];

    //     this.setState({ affiliations: this.state.affiliations.concat(newAffiliation) });
    // };

    // /**
    //  * delete affiation object from an array using array index 
    //  * @param index 
    //  */
    // deleteAffiliation(index: number) {
    //     let arr = this.state.affiliations;
    //     arr.splice(index, 1);
    //     this.setState({ affiliations: arr });
    // };

    // /**
    //  * Save/update local state and call input validation function
    //  * @param event 
    //  * @param index 
    //  */
    // affiliationJobTitleOnChange(event: any, index: number) {
    //     let value = event.target.value;
    //     this.saveLocalState(value, index, 'title');
    //     this.validateInput(value, index, 'validatedStatusJobTitle', 'helpTextJobTitle', 'string', 50);
    // };

    // // isYearValid(value: number): boolean {
    // //     // e: euler's number and -: negative sign is handled in euler function)
    // //     // if it's an int, and positive number, and 0 < length <= 4
    // //     // then it's a valid 4-digit year  
    // //     // const numValue = parseInt(value, 10);
    // //     // console.log(
    // //     //     'Int value?', value, numValue, value.length, (typeof numValue === 'number'), (numValue > 0), value.length === 4
    // //     // );
    // //     if (typeof numValue === 'number' && numValue > 0 && value.length === 4) {
    // //         return true;
    // //     } else {
    // //         return false;
    // //     }
    // // }
    // /**
    //  * Save/update local state and call input validation function
    //  * check if it's smaller than the corresponding end year
    //  * @param event 
    //  * @param index 
    //  */
    // affiliationStartOnChange(newValue: number | undefined, index: number) {
    //     // this.saveLocalState(String(newValue || ''), index, 'started');
    //     if (typeof newValue === 'undefined') {
    //         return;
    //     }

    //     const affiliations = this.state.affiliations;
    //     const endYear = affiliations[index].ended;
    //     // check if the entered start year is less than end year if it is already entered.
    //     if (endYear) {
    //         console.log('end year??', endYear);
    //         // while entered start year is less than end year, other validations are not required.
    //         // update validated status to error and set help text. 
    //         if (newValue > endYear) {
    //             affiliations[index].validatedStatusStartYear = 'error';
    //             affiliations[index].helpTextStartYear = 'must be less than end year';
    //         } else if (newValue <= endYear) {
    //             // otherwise set validated state and helpText to undefined 
    //             /// and let the validate input function set the validated state.
    //             affiliations[index].validatedStatusStartYear = undefined;
    //             affiliations[index].helpTextStartYear = undefined;
    //         };
    //     } else {
    //         affiliations[index].validatedStatusStartYear = undefined;
    //         affiliations[index].helpTextStartYear = undefined;
    //     }
    //     this.setState({ affiliations });
    // };

    // /**
    //  * Save/update local state and call input validation function
    //  * check if it's later than the corresponding start year. 
    //  * @param newValue - the newly set affiliation end date 
    //  * @param index - the index of the affiliation within the affiliations collection
    //  */
    // affiliationEndOnChange(newValue: number | undefined, index: number) {
    //     const affiliations = this.state.affiliations;
    //     const affiliation = affiliations[index];

    //     // if the entry is empty, then set the state to undefined.
    //     if (!newValue) {
    //         affiliation.validatedStatusEndYear = undefined;
    //         affiliation.ended = undefined;
    //         affiliation.helpTextEndYear = undefined;
    //     } else {
    //         if (affiliation.started) {
    //             if (newValue < affiliation.started) {
    //                 affiliation.validatedStatusEndYear = 'error';
    //                 affiliation.helpTextEndYear = 'must be greater than or equal to the start year, or empty';
    //             } else if (newValue >= affiliation.started) {
    //                 affiliation.validatedStatusEndYear = undefined;
    //                 affiliation.helpTextEndYear = undefined;
    //                 affiliation.helpTextStartYear = undefined;
    //                 affiliation.validatedStatusStartYear = undefined;
    //             }
    //         }
    //     }
    //     this.setState({ affiliations });
    // };

    // /**
    //  * Save/update local state and call input validation function
    //  * filters list of insitution before update state.
    //  * @param value 
    //  * @param index 
    //  */
    // institutionOnSearch(value: string, index: number) {
    //     this.validateInput(value, index, 'validatedStatusOrganization', 'helpTextOrganization', 'string', 100, 2);
    //     this.saveLocalState(value, index, 'organization');
    //     if (value.length > 2) {
    //         let arr = [];
    //         arr = institution.filter(item =>
    //             item.toLowerCase().includes(value.toLowerCase())
    //         );
    //         if (arr.length <= 30) {
    //             this.setState({ institutionFiltered: arr });
    //         };
    //     };
    // };

    // /**
    //  * Update Store state 
    //  *   - check if there is no error on the form
    //  *   - create a new array of affliation
    //  */
    // affiliationOnSave() {
    //     let update = true; // only when update is set to true, update store state.
    //     const profileData = this.props.profileData; // any is used in order to use generic properties
    //     const affiliationsProps = this.props.affiliations; // any is used in order to use generic properties
    //     const affiliationsState = this.state.affiliations; // any is used in order to use generic properties
    //     const affiliationsToSave = [];

    //     // if affiliation is added or deleted, update store state
    //     if (affiliationsProps.length !== affiliationsState.length) update = true;

    //     for (let i = 0; i < this.state.affiliations.length; i += 1) {
    //         const affiliation = this.state.affiliations[i];
    //         // don't update store state if any of the field is in invalid state
    //         if (affiliation.validatedStatusJobTitle === 'error' ||
    //             affiliation.validatedStatusOrganization === 'error' ||
    //             affiliation.validatedStatusStartYear === 'error' ||
    //             affiliation.validatedStatusEndYear === 'error') {
    //             update = false;
    //             break;
    //         };

    //         // If there is a better way to make a new object and add keys in typescript, please let me know. 
    //         if (!affiliation.started) {
    //             throw new Error('Started date may not be empty (runtime error)');
    //         }

    //         const affiliationToSave: Affiliation = {
    //             title: affiliation.title,
    //             organization: affiliation.organization,
    //             started: affiliation.started,
    //             ended: affiliation.ended || null
    //         };


    //         // for (const element in keys) {
    //         //     if (affiliationsProps[i] !== undefined) {
    //         //         // if any value is changed, update store state
    //         //         if (affiliationsState[i][element] !== affiliationsProps[i][element]) {
    //         //             update = true;
    //         //         };
    //         //     }

    //         //     const obj = { [element]: affiliationsState[i][element] };
    //         //     affiliObj = Object.assign(affiliObj, obj);
    //         // }
    //         affiliationsToSave.push(affiliationToSave);
    //     };

    //     if (update) {
    //         profileData.affiliations = affiliationsToSave;
    //         this.props.updateStoreState(profileData, this.props.userName);
    //     };
    // };



    // /**
    //  * if profile is auth user's profile, then edit is enabled, then make tool tips visible
    //  */
    // tooltipVisibility(): CSSProperties {
    //     if (this.props.editEnable === false) {
    //         return { visibility: 'hidden' };
    //     } else {
    //         return { visibility: 'visible' };
    //     };
    // };

    // /**
    //  * handle negative and Euler's number
    //  */
    // euler(keyCode: number, property: string, helptext: string, index: number): void {
    //     if (keyCode === 189 || keyCode === 69) {
    //         let affiliationArray: any = this.state.affiliations;
    //         affiliationArray[index][property] = "error";
    //         affiliationArray[index][helptext] = 'expecting 4 digit year';
    //         this.setState({ affiliations: affiliationArray });
    //     }
    // }

    // endDateMin(affiliation: AffiliationValidated): number {
    //     if (affiliation.started) {
    //         return affiliation.started;
    //     } else {
    //         return MIN_AFFILIATION_DATE;
    //     }
    // }

    // editEnable(): boolean {
    //     return true;
    // }

    // deleteAffiliation(index: number) {
    //     console.log(`will delete affiliation ${index}`);
    // }

    /**
     * builds affiliation card
     */
    // affiliations() {
    //     // TODO: change BFF so that it will return an empty array when there is no data
    //     // so instead of using this -> affiliations[0]['title'], affiliations.length > 0
    //     // let profileIsEmpty;
    //     // if (this.props.affiliations.length === 0) {
    //     //     profileIsEmpty = true;
    //     // } else if (this.props.affiliations[0]['title']) {
    //     //     if (this.props.affiliations[0]['title'] === '') {
    //     //         profileIsEmpty = true;
    //     //     };
    //     // } else {
    //     //     profileIsEmpty = false;
    //     // };

    //     // if (profileIsEmpty === false) {
    //     return (
    //         <div id='affiliations'>
    //             {this.props.affiliations.map((affiliation, index) => {
    //                 // NOTE: this is done locally because TS/antd freak out when calling 
    //                 // this.endDateMin
    //                 // let endDateMin: number;
    //                 // if (affiliation.started) {
    //                 //     endDateMin = affiliation.started;
    //                 // } else {
    //                 //     endDateMin = MIN_AFFILIATION_DATE;
    //                 // }

    //                 return <div key={String(index)}>
    //                     <AffiliationForm
    //                         affiliation={affiliation}
    //                         editEnable={this.editEnable.bind(this)}
    //                         deleteAffiliation={() => {
    //                             this.deleteAffiliation(index);
    //                         }}
    //                         saveAffiliation={this.saveAffiliation.bind(this)}
    //                     />
    //                 </div>;
    //             })}

    //             <Button style={{ margin: '10px', display: this.showEditButtons() }} key="add" type="primary" onClick={this.addAffiliation}>
    //                 Add
    //                 </Button>
    //             <Button
    //                 disabled={this.saveDisabled()}
    //                 style={{ margin: '10px', display: this.showEditButtons() }}
    //                 key="submit"
    //                 type="primary"
    //                 onClick={this.affiliationOnSave.bind(this)}>
    //                 Save
    //                 </Button>
    //         </div>
    //     );

    // };

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
        // console.log('deleting affiliations?', affiliations);
        this.props.updateStoreState(newProfile, this.props.userName);
    }

    doEditEnable() {
        return true;
    }

    doSaveAffiliation(affiliation: Affiliation, index: number) {
        const affiliations = this.state.affiliations;
        affiliations[index] = affiliation;
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
        console.log('save new affiliation', newProfile);
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
        // const emptyAffiliation: Affiliation = {
        //     title: '',
        //     organization: '',
        //     started: 0,
        //     ended: null

        // }

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
