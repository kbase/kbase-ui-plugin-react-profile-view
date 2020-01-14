import React, { CSSProperties } from 'react';
import { Form, Input, AutoComplete, Tooltip, Select, Empty, Button, Icon } from 'antd';
import { Affiliation, ProfileData, UserName } from '../../../redux/interfaces';
import { institution } from '../../../dataSources';

const { Option } = Select;


interface AffiliationValidated {
    title: string;
    organization: string;
    started: string | undefined;
    ended: string | undefined;
    validatedStatusJobTitle: "" | "error" | "success" | "warning" | "validating" | undefined;
    validatedStatusOrganization: "" | "error" | "success" | "warning" | "validating" | undefined;
    validatedStatusStartYear: "" | "error" | "success" | "warning" | "validating" | undefined;
    validatedStatusEndYear: "" | "error" | "success" | "warning" | "validating" | undefined;
    helpTextJobTitle: string | undefined;
    helpTextOrganization: string | undefined;
    helpTextStartYear: string | undefined;
    helpTextEndYear: string | undefined;
};

interface State {
    affiliations: Array<AffiliationValidated>;
    institutionFiltered: Array<string>;
};

interface Props {
    userName: UserName;
    profileData: ProfileData;
    editEnable: boolean;
    affiliations: Array<Affiliation>;
    updateStoreState: (data: any, userName: UserName) => void;
};

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 1 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 23 },
    },
};

class AffiliationForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            affiliations: [],
            institutionFiltered: [],
        };

        this.showEditButtons = this.showEditButtons.bind(this);
        this.tooltipVisibility = this.tooltipVisibility.bind(this);
        this.requiredNotificationControl = this.requiredNotificationControl.bind(this);
        this.saveDisabled = this.saveDisabled.bind(this);
        this.validateInput = this.validateInput.bind(this);
        this.saveLocalState = this.saveLocalState.bind(this);
        this.addAffiliation = this.addAffiliation.bind(this);
        this.deleteAffiliation = this.deleteAffiliation.bind(this);
        this.affiliationJobTitleOnChange = this.affiliationJobTitleOnChange.bind(this);
        this.affiliationStartOnChange = this.affiliationStartOnChange.bind(this);
        this.affiliationEndOnChange = this.affiliationEndOnChange.bind(this);
        this.affiliationOnSave = this.affiliationOnSave.bind(this);
        this.institutionOnSearch = this.institutionOnSearch.bind(this);
        this.affiliations = this.affiliations.bind(this);
    };

    componentDidMount() {
        let newAffiliations: Array<AffiliationValidated> = [];
        for (let i = 0; i < this.props.affiliations.length; i += 1) {
            let obj = {
                title: this.props.affiliations[i]['title'],
                organization: this.props.affiliations[i]['organization'],
                started: this.props.affiliations[i]['started'],
                ended: this.props.affiliations[i]['ended'],
                validatedStatusJobTitle: undefined,
                validatedStatusOrganization: undefined,
                validatedStatusStartYear: undefined,
                validatedStatusEndYear: undefined,
                helpTextJobTitle: undefined,
                helpTextOrganization: undefined,
                helpTextStartYear: undefined,
                helpTextEndYear: undefined,
            };
            newAffiliations.push(obj);
        };
        this.setState({ affiliations: newAffiliations });
    };

    // show/hide edit/save buttons
    showEditButtons() {
        if (this.props.editEnable === true) {
            return 'unset';
        } else {
            return 'none';
        };
    };

    // show/hide required notification 
    requiredNotificationControl() {
        if (this.props.editEnable) {
            return true;
        } else {
            return false;
        };
    };
    // disables save button while validated states is error.
    saveDisabled() {
        for (let i = 0; i < this.state.affiliations.length; i += 1) {
            let affilicationObj = this.state.affiliations[i];
            if(Object.values(affilicationObj).includes('error')) {
                return true;
            };
        };
    };


    // event handlers//    
    /** 
    * Validate value against 
    *  - max and min length
    *  - if it's required field
    *  - type 
    * and set state per validation result.
    * @param inputValue 
    */
    validateInput(inputValue: string, index: number, property: string, helperTextProp: string, type: string, max: number, min?: number) {

        // it has to be set to "any" in order to use generic property name    
        let affiliationArray: any = this.state.affiliations;
        // When type is number, then check if it's a number first
        if (type === "number" && isNaN(parseInt(inputValue, 10))) {
            affiliationArray[index][property] = "error";
            affiliationArray[index][helperTextProp] = 'Expecting numbers';
            this.setState({ affiliations: affiliationArray });
            return;
        };

        // check against min and max length
        if (typeof min === 'undefined') min = 2;
        if (inputValue.length <= max && inputValue.length >= min) {

            affiliationArray[index][property] = 'success';
            affiliationArray[index][helperTextProp] = undefined;
            this.setState({ affiliations: affiliationArray });

        } else if (inputValue.length < min) {

            affiliationArray[index][property] = 'error';
            affiliationArray[index][helperTextProp] = 'input must be at least ' + min + ' characters';
            this.setState({ affiliations: affiliationArray });

        } else if (inputValue.length > max) {

            // this shouldn't happen since input field max length is set
            affiliationArray[index][property] = 'error';
            affiliationArray[index][helperTextProp] = 'input must be less than ' + max + ' characters';
            this.setState({ affiliations: affiliationArray });
        };
    };

    /**
    * Save/update input value to state
    * @param event 
    */
    saveLocalState(value: string, index: number, property: string) {
        let affiliations: any = this.state.affiliations;
        affiliations[index][property] = value.trim();
        this.setState({ affiliations: affiliations });
    };

    /**
     * Add a new affiliation object to arrlication array
     * @param event 
     */
    addAffiliation(event: any) {
        let newAffiliation: Array<AffiliationValidated> = [{
            title: '',
            organization: '',
            started: undefined,
            ended: undefined,
            validatedStatusJobTitle: 'error',
            validatedStatusOrganization: 'error',
            validatedStatusStartYear: 'error',
            validatedStatusEndYear: undefined,
            helpTextJobTitle: undefined,
            helpTextOrganization: undefined,
            helpTextStartYear: undefined,
            helpTextEndYear: undefined,
        }];

        this.setState({ affiliations: this.state.affiliations.concat(newAffiliation) });
    };

    /**
     * delete affiation object from an array using array index 
     * @param index 
     */
    deleteAffiliation(index: number) {
        let arr = this.state.affiliations;
        arr.splice(index, 1);
        this.setState({ affiliations: arr });
    };

    /**
     * Save/update local state and call input validation function
     * @param event 
     * @param index 
     */
    affiliationJobTitleOnChange(event: any, index: number) {
        let value = event.target.value;
        this.saveLocalState(value, index, 'title');
        this.validateInput(value, index, 'validatedStatusJobTitle', 'helpTextJobTitle', 'string', 50);
    };

    /**
     * Save/update local state and call input validation function
     * check if it's smaller than the corresponding end year
     * @param event 
     * @param index 
     */
    affiliationStartOnChange(event: any, index: number) {
        let value = event.target.value;
        let endYear =  this.state.affiliations[index]['ended'];
        // check if the entered start year is less than end year if it is already entered.
        if(typeof endYear !== 'undefined') {
            let affiliationArray = this.state.affiliations;
            // while entered start year is less than end year, other validations are not required.
            // update validated status to error and set helpt text. 
            if (value > endYear) {
                affiliationArray[index]['validatedStatusStartYear'] = 'error';
                affiliationArray[index]['helpTextStartYear'] = 'must be less than end year';
                this.setState({ affiliations: affiliationArray });
                return;
            } else {
                // other wise set validated state and helpText to undefined 
                /// and let the validate input function set the validated state.
                affiliationArray[index]['validatedStatusStartYear'] = undefined;
                affiliationArray[index]['helpTextStartYear'] = undefined;
                this.setState({ affiliations: affiliationArray });
            };   
        }
        this.saveLocalState(value, index, 'started');
        this.validateInput(value, index, 'validatedStatusStartYear', 'helpTextStartYear', 'number', 4, 4);
    };

    /**
     * Save/update local state and call input validation function
     * check if it's later than the corresponding start year. 
     * @param event 
     * @param index 
     */
    affiliationEndOnChange(event: any, index: number) {
        let value = event.target.value;
        let affiliationArray = this.state.affiliations;
        // if the start date is already entered and is larger than the entered value, 
        // set the valudated status to error and set help text. 
        let startDate = this.state.affiliations[index]['started'];
        if (startDate!== undefined) {
            if (value < startDate ) {
                affiliationArray[index]['validatedStatusEndYear'] = 'error';
                affiliationArray[index]['helpTextEndYear'] = 'must be larger than start year';
                this.setState({ affiliations: affiliationArray });
                return;
            };
        };
        this.saveLocalState(value, index, 'ended');
        // if the entry is empty, then set the state to undefined. 
        if(value.length > 0) {
            this.validateInput(value, index, 'validatedStatusEndYear', 'helpTextEndYear', 'number', 4, 4);
        } else {
            affiliationArray[index]['validatedStatusEndYear'] = undefined;
            affiliationArray[index]['ended'] = undefined;
            affiliationArray[index]['helpTextEndYear'] = undefined;
            this.setState({ affiliations: affiliationArray });
        };
    };
    
    /**
     * Save/update local state and call input validation function
     * filters list of insitution before update state.
     * @param value 
     * @param index 
     */
    institutionOnSearch(value: string, index: number) {
        this.validateInput(value, index, 'validatedStatusOrganization', 'helpTextOrganization', 'string', 100, 2);
        this.saveLocalState(value, index, 'organization');
        if (value.length > 2) {
            let arr = [];
            arr = institution.filter(item =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            if (arr.length <= 30) {
                this.setState({ institutionFiltered: arr });
            };
        };
    };

    /**
     * Update Store state 
     *   - check if there is no error on the form
     *   - create a new array of affliation
     */
    affiliationOnSave() {
        let update = false; // only when update is set to true, update store state.
        let keys = ['title', 'organization', 'started', 'ended'] // if there is a way to have this not hard coded, please let me know
        let profileData: any = this.props.profileData; // any is used in order to use generic properties
        let affiliationsProps: any = this.props.affiliations; // any is used in order to use generic properties
        let affiliationsState: any = this.state.affiliations; // any is used in order to use generic properties
        let affiliArr = [];

        // if afflication is added or deleted, update store state
        if (affiliationsProps.length !== affiliationsState.length) update = true;

        for (let i = 0; i < this.state.affiliations.length; i += 1) {
            // don't update store state if any of the field is in invalid state
            if (this.state.affiliations[i]['validatedStatusJobTitle'] === 'error' ||
                this.state.affiliations[i]['validatedStatusOrganization'] === 'error' ||
                this.state.affiliations[i]['validatedStatusStartYear'] === 'error' ||
                this.state.affiliations[i]['validatedStatusEndYear'] === 'error') {
                break;
            };

            // If there is a better way to make a new object and add keys in typescript, please let me know. 
            let affiliObj: object = {};

            keys.forEach(element => {
                if (affiliationsProps[i] !== undefined) {
                    // if any value is changed, update store state
                    if (affiliationsState[i][element] !== affiliationsProps[i][element]) {
                        update = true;
                    };
                };

                let obj = { [element]: affiliationsState[i][element] };
                affiliObj = Object.assign(affiliObj, obj);
            });

            affiliArr.push(affiliObj);
        };

        if (update) {
            profileData.affiliations = affiliArr as Array<Affiliation>;
            this.props.updateStoreState(profileData, this.props.userName);
        };
    };



    /**
     * if profile is auth user's profile, then edit is enabled, then make tool tips visible
     */
    tooltipVisibility(): CSSProperties {
        if (this.props.editEnable === false) {
            return { visibility: 'hidden' };
        } else {
            return { visibility: 'visible' };
        };
    };

    /**
     * builds affiliation card
     */
    affiliations() {
        // TODO: change BFF so that it will return an empty array when there is no data
        // so instead of using this -> affiliations[0]['title'], affiliations.length > 0
        let profileIsEmpty;
        if(this.props.affiliations.length === 0) {
            profileIsEmpty = true;
        } else if(this.props.affiliations[0]['title']){
            if(this.props.affiliations[0]['title'] === ''){
                profileIsEmpty = true;
            };
        } else {
            profileIsEmpty = false;
        };

        if (profileIsEmpty === false) {
            return (
                <div id='affiliations'>
                    {this.state.affiliations.map((position, index) => (
                        <form key={index} className='affiliation-row ant-form ant-form-inline' name={index.toString(10)} autoComplete="on">
                            <Form.Item {...formItemLayout}
                                className="profile-input-form"
                                required={this.requiredNotificationControl()}
                                label=' '
                                hasFeedback
                                help={this.state.affiliations[index]['helpTextJobTitle']}
                                validateStatus={this.state.affiliations[index]['validatedStatusJobTitle']}
                            ><Input
                                readOnly={!this.props.editEnable}
                                style={{ width: '100%' }}
                                autoComplete='organization-title'
                                type='text'
                                className='clear-disabled'
                                maxLength={50}
                                defaultValue={position.title}
                                placeholder={'Job title'}
                                onChange={(event) => { this.affiliationJobTitleOnChange(event, index) }}
                            /></Form.Item>
                            <Form.Item {...formItemLayout}
                                style={{ flexGrow: 1 }}
                                className="profile-input-form"
                                required={this.requiredNotificationControl()}
                                label=' '
                                hasFeedback
                                help={this.state.affiliations[index]['helpTextOrganization']}
                                validateStatus={this.state.affiliations[index]['validatedStatusOrganization']}
                            ><AutoComplete
                                className='clear-disabled'
                                allowClear
                                disabled={!this.props.editEnable}
                                placeholder='Organization'
                                onSelect={(item) => { this.saveLocalState(item as string, index, 'organization') }}
                                onSearch={(value) => { this.institutionOnSearch(value, index) }}
                                filterOption={(inputValue, option) => {

                                    if (typeof option.props.children === 'string') {
                                        let item = option.props.children;
                                        return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                                    } else {
                                        return false;
                                    };

                                }}
                                defaultValue={position.organization}
                            >
                                    {this.state.institutionFiltered.map((item, index) => {
                                        return (
                                            <Option style={{ width: '90%' }} className='clear-disabled' key={index} value={item} >
                                                {item}
                                            </Option>
                                        );
                                    })}
                            </AutoComplete></Form.Item>
                            <Tooltip overlayStyle={this.tooltipVisibility()} title='Enter 4 digits start year and end year'>
                                <Form.Item {...formItemLayout}
                                    className="profile-input-form"
                                    required={this.requiredNotificationControl()}
                                    label=' '
                                    hasFeedback
                                    help={this.state.affiliations[index]['helpTextStartYear']}
                                    validateStatus={this.state.affiliations[index]['validatedStatusStartYear']}
                                ><Input
                                    readOnly={!this.props.editEnable}
                                    style={{ width: '90px', display: 'inline' }}
                                    onChange={(item) => { this.affiliationStartOnChange(item, index) }}
                                    type='number'
                                    maxLength={4}
                                    className='clear-disabled'
                                    placeholder='Start'
                                    defaultValue={position.started}
                                /></Form.Item>
                            </Tooltip>
                            <Tooltip overlayStyle={this.tooltipVisibility()} title='Enter 4 digits start year and end year'>
                                <Form.Item {...formItemLayout}
                                    className="profile-input-form"
                                    required={false}
                                    label=' '
                                    hasFeedback
                                    help={this.state.affiliations[index]['helpTextEndYear']}
                                    validateStatus={this.state.affiliations[index]['validatedStatusEndYear']}
                                ><Input
                                    readOnly={!this.props.editEnable}
                                    style={{ width: '90px', display: 'inline' }}
                                    onChange={(item) => { this.affiliationEndOnChange(item, index) }}
                                    type='number'
                                    maxLength={4}
                                    className='clear-disabled'
                                    placeholder='End'
                                    defaultValue={position.ended}
                                /></Form.Item>
                            </Tooltip>
                            <Icon type="delete" style={{ display: this.showEditButtons(), verticalAlign: "-webkit-baseline-middle" }} onClick={() => this.deleteAffiliation(index)} />
                            {/* <Button style={{ margin: '10px', display: this.showEditButtons() }} type="primary" onClick={() => this.deleteAffiliation(index)}>
                                delete
                            </Button> */}
                        </form>
                    ))}
                    <Button style={{ margin: '10px', display: this.showEditButtons() }} key="add" type="primary" onClick={this.addAffiliation}>
                        Add
                    </Button>
                    <Button disabled={this.saveDisabled()} style={{ margin: '10px', display: this.showEditButtons() }} key="submit" type="primary" onClick={this.affiliationOnSave}>
                        Save
                    </Button>
                </div>
            );
        } else {
            return (
                <div id='affiliations'>
                    {this.state.affiliations.map((position, index) => (
                        <form key={index} className='affiliation-row ant-form ant-form-inline' name={index.toString(10)} autoComplete="on">
                            <Form.Item {...formItemLayout}
                                className="profile-input-form"
                                required={this.requiredNotificationControl()}
                                label=' '
                                hasFeedback
                                help={this.state.affiliations[index]['helpTextJobTitle']}
                                validateStatus={this.state.affiliations[index]['validatedStatusJobTitle']}
                            ><Input
                                readOnly={!this.props.editEnable}
                                style={{ width: '100%' }}
                                autoComplete='organization-title'
                                type='text'
                                className='clear-disabled'
                                maxLength={50}
                                defaultValue={position.title}
                                placeholder={'Job title'}
                                onChange={(event) => { this.affiliationJobTitleOnChange(event, index) }}
                            /></Form.Item>
                            <Form.Item {...formItemLayout}
                                style={{ flexGrow: 1 }}
                                className="profile-input-form"
                                required={this.requiredNotificationControl()}
                                label=' '
                                hasFeedback
                                help={this.state.affiliations[index]['helpTextOrganization']}
                                validateStatus={this.state.affiliations[index]['validatedStatusOrganization']}
                            ><AutoComplete
                                className='clear-disabled'
                                allowClear
                                disabled={!this.props.editEnable}
                                placeholder='Organization'
                                onSelect={(item) => { this.saveLocalState(item as string, index, 'organization') }}
                                onSearch={(value) => { this.institutionOnSearch(value, index) }}
                                filterOption={(inputValue, option) => {

                                    if (typeof option.props.children === 'string') {
                                        let item = option.props.children;
                                        return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                                    } else {
                                        return false;
                                    };

                                }}
                                defaultValue={position.organization}
                            >
                                    {this.state.institutionFiltered.map((item, index) => {
                                        return (
                                            <Option style={{ width: '90%' }} className='clear-disabled' key={index} value={item} >
                                                {item}
                                            </Option>
                                        );
                                    })}
                            </AutoComplete></Form.Item>
                            <Tooltip overlayStyle={this.tooltipVisibility()} title='Enter 4 digits start year and end year'>
                                <Form.Item {...formItemLayout}
                                    className="profile-input-form"
                                    required={this.requiredNotificationControl()}
                                    label=' '
                                    hasFeedback
                                    help={this.state.affiliations[index]['helpTextStartYear']}
                                    validateStatus={this.state.affiliations[index]['validatedStatusStartYear']}
                                ><Input
                                    readOnly={!this.props.editEnable}
                                    style={{ width: '90px', display: 'inline' }}
                                    onChange={(item) => { this.affiliationStartOnChange(item, index) }}
                                    type='number'
                                    maxLength={4}
                                    className='clear-disabled'
                                    placeholder='Start'
                                    defaultValue={position.started}
                                /></Form.Item>
                            </Tooltip>
                            <Tooltip overlayStyle={this.tooltipVisibility()} title='Enter 4 digits start year and end year'>
                                <Form.Item {...formItemLayout}
                                    className="profile-input-form"
                                    required={false}
                                    label=' '
                                    hasFeedback
                                    help={this.state.affiliations[index]['helpTextEndYear']}
                                    validateStatus={this.state.affiliations[index]['validatedStatusEndYear']}
                                ><Input
                                    readOnly={!this.props.editEnable}
                                    style={{ width: '90px', display: 'inline' }}
                                    onChange={(item) => { this.affiliationEndOnChange(item, index) }}
                                    type='number'
                                    maxLength={4}
                                    className='clear-disabled'
                                    placeholder='End'
                                    defaultValue={position.ended}
                                /></Form.Item>
                            </Tooltip>
                            <Icon type="delete" style={{ display: this.showEditButtons() }} onClick={() => this.deleteAffiliation(index)} />
                            {/* <Button style={{ margin: '10px', display: this.showEditButtons() }} type="primary" onClick={() => this.deleteAffiliation(index)}>
                                delete
                            </Button> */}
                        </form>
                    ))}
                    <Button style={{ margin: '10px', display: this.showEditButtons() }} key="add" type="primary" onClick={this.addAffiliation}>
                        Add
                    </Button>
                    <Button disabled={this.saveDisabled()} style={{ margin: '10px', display: this.showEditButtons() }} key="submit" type="primary" onClick={this.affiliationOnSave}>
                        Save
                    </Button>
                </div>
            );
        };
    };
    render() {
        return this.affiliations();
    };
};


export default AffiliationForm;