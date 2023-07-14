import { CloseOutlined, DeleteOutlined, EditOutlined, ExclamationOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { AsyncProcessStatus } from '@kbase/ui-lib';
import {
    Alert,
    Button,
    Checkbox,
    Col,
    Empty,
    Form,
    Image,
    Input,
    List,
    Modal,
    Radio,
    Row,
    Select,
    Space,
    Spin,
    Switch,
    Typography,
    message
} from 'antd';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import orcidIcon from '../../assets/ORCID-iD_icon-vector.svg';
import nouserpic from '../../assets/nouserpic.png';
import { ORCID_URL } from '../../constants';
import { options as statesOptions } from '../../dataSources/USStates';
import avatarOptions from '../../dataSources/avatarOptions';
import countryCodes from '../../dataSources/countryCodes';
import { options as fundingSourceOptions } from '../../dataSources/fundingSources';
import gravatarDefaults from '../../dataSources/gravatarDefaults';
import jobTitles from '../../dataSources/jobTitlesOptions';
import researchInterestsList from '../../dataSources/researchInterestsOptions';
import { ORCIDState, ProfileView } from '../../redux/interfaces';
import { UserProfileAffiliation, UserProfileUpdate, UserProfileUserdata } from '../../util/API';
import { hasOwnProperty, noScriptTag } from '../../util/utils';
import Area from '../Area';
import OrgsContainer from '../Orgs/OrgsContainer';
import './Profile.css';
import OrganizationField from './fields/Organization';


export interface ProfileProps {
    profileView: ProfileView
    orcidState: ORCIDState;
    baseUrl: string;
    updateProfile: (profile: UserProfileUpdate) => void;
    checkORCID: (username: string) => void;
    fetchProfile: (username: string) => void;

}

export type KeyOfType<Type, ValueType> = keyof {
    [Key in keyof Type as Type[Key] extends ValueType ? Key : never]: any;
};

export interface FormDataAffiliation {
    title: string
    organization: string
    started: string
    ended?: string | null
}

export interface FormData {
    avatarOption: string
    gravatarDefault?: string
    jobTitle?: string
    jobTitleOther?: string
    department?: string
    organization?: string
    country?: string
    state?: string
    city?: string
    postalCode?: string
    fundingSource?: string
    researchStatement?: string
    researchInterests?: Array<string>
    researchInterestsOther?: string
    affiliations?: Array<FormDataAffiliation>
    showORCIDId: boolean
}

// Note that this should be exported from antd
// TODO: investigate and possibly create issue on github; stretch - create PR.
interface FieldData {
    name: string | number | (string | number)[];
    value?: unknown;
    touched?: boolean;
    validating?: boolean;
    errors?: string[];
}

/**
 * Returns profile component.
 * @param props
 */
// class Profile extends React.Component<ProfileProps, ProfileState> {
function Profile(props: ProfileProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const avatarOptionWatch = Form.useWatch('avatarOption', { form });
    const gravatarDefaultWatch = Form.useWatch('gravatarDefault', { form });
    const countryWatched = Form.useWatch('country', { form });
    const jobTitleWatched = Form.useWatch('jobTitle', { form });
    const [isFormValid, setIsFormValid] = useState(false);
    const [isFormTouched, setIsFormTouched] = useState(false);
    const [messageAPI, contextHolder] = message.useMessage();
    const showORCIDIdWatched = Form.useWatch('showORCIDId', { form })

    function enableEditing() {
        setIsEditing(true);
    }

    function disableEditing() {
        setIsEditing(false);
    }

    function showSuccess(message: string, duration = 3000) {
        messageAPI.open({
            type: 'success',
            content: message,
            duration
        });
    }

    function saveProfile(profile: UserProfileUpdate) {
        props.updateProfile(profile);
        showSuccess('Saved changes to your Profile');
    }

    // Create tootip for Organization Auto Complete
    // function institutionToolTip() {
    //     return (
    //         <div>
    //             <p>Your primary association - organization, institution, business.<br />
    //                 You may enter your own value or chose from the option fileted by your entry.<br />
    //                 National Labs derived from: <a href='https://science.energy.gov/laboratories/' target='_blank' rel="noopener noreferrer">DOE Web Site - Laboratories</a><br />
    //                 US higher education institutions derived from: <a href='http://carnegieclassifications.iu.edu/index.php' target='_blank' rel="noopener noreferrer">Carnegie Classification of Institutions of Higher Education </a>
    //             </p>
    //         </div>
    //     );
    // }

    function renderJobTitleOtherField() {
        return <Form.Item
            name="jobTitleOther"
            required={true}
            label="Position (Other)"
            // hasFeedback
            rules={[
                { min: 2, message: `Position (other) must be more than ${2} characters long` },
                { max: 1000, message: `Position (other) must be less than ${50} characters long` },
                {
                    validator: async (_, value: string) => {
                        noScriptTag(value);
                    }
                }
            ]}
        >
            <Input
                allowClear={true}
                placeholder="Job Title"
                minLength={2}
                maxLength={50}
            />
        </Form.Item>
    }

    function renderDepartmentField() {
        return <Form.Item
            name="department"
            label="Department"
            // hasFeedback 
            rules={[
                { min: 2, message: `Department must be more than ${2} characters long` },
                { max: 1000, message: `Department must be less than ${50} characters long` },
                {
                    validator: async (_, value: string) => {
                        noScriptTag(value);
                    }
                }
            ]}
        >
            <Input
                allowClear={true}
                autoComplete='off'
                minLength={2}
                maxLength={50}
            />
        </Form.Item>
    }

    function renderOrganizationField() {
        return <OrganizationField name="organization" label="Organization" required={false} />
    }

    function renderCountryField() {
        return <Form.Item
            name="country"
            label='Country' >
            <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                filterOption={(inputValue, option) => {
                    if (!option) {
                        return false;
                    }
                    return option.label.toLowerCase().includes(inputValue.toLowerCase());
                }}
                options={countryCodes}
            />
        </Form.Item>
    }

    function renderStateField() {
        return <Form.Item
            name="state"
            label='State'>
            <Select
                popupMatchSelectWidth
                allowClear
                showArrow
                filterOption={(inputValue, option) => {
                    if (!option) {
                        return false;
                    }
                    return option.label.toLowerCase().includes(inputValue.toLowerCase())
                }}
                options={statesOptions}
            />
        </Form.Item>
    }

    function renderCityField() {
        return <Form.Item
            name="city"
            label="City"
            // hasFeedback 
            help=""
        >
            <Input
                allowClear={true}
                minLength={0}
                maxLength={85}
            />
        </Form.Item>

    }

    function renderPostalCode() {
        const [label, min, max, message] = (() => {
            if (countryWatched === 'United States') {
                return ['Zip Code', 5, 10, `Zip code must be between 5 and 10 characters`];
            }
            return ['Postal Code', 0, 16, 'Postal Code may be at most 16 characters']
        })();
        return <Form.Item
            name="postalCode"
            label={label}
            // hasFeedback 
            rules={[
                {
                    type: 'string',
                    min,
                    max,
                    message
                },
                {
                    validator: async (_, value: string) => {
                        noScriptTag(value);
                    }
                }
            ]}
        >
            <Input
                allowClear={true}
                autoComplete='off'
                minLength={min}
                maxLength={max}
            />
        </Form.Item>
    }

    function renderPrimaryFundingSource() {
        return <Form.Item
            name="fundingSource"
            label="Primary Funding Source">
            <Select
                allowClear
                showSearch
                showArrow={true}
                optionFilterProp='children'
                filterOption={(inputValue, option) => {
                    if (!option) {
                        return false;
                    }
                    return option.label.toLowerCase().includes(inputValue.toLowerCase());
                }}
                options={fundingSourceOptions}
            />
        </Form.Item>
    }

    function renderJobTitleField() {
        return <Form.Item
            label="Position"
            name="jobTitle"
        >
            <Select
                placeholder='Job title'
                allowClear
                options={jobTitles}
            />
        </Form.Item>
    }

    function renderLocation() {
        const location = <div>
            {renderCountryField()}
            {/* State - only displayed if US is chosen for country */}
            {countryWatched === 'United States' ? renderStateField() : ''}
            <Row gutter={8}>
                <Col span={14}>
                    {renderCityField()}
                </Col>
                <Col span={10}>
                    {renderPostalCode()}
                </Col>
            </Row>
        </div>
        return renderSection('location', location);
    }

    function renderUserNutshellEditor() {
        function renderJobTitle() {
            if (jobTitleWatched === 'Other') {
                return <Row gutter={8}>
                    <Col span={6}>
                        {renderJobTitleField()}
                    </Col>
                    <Col span={18}>
                        {renderJobTitleOtherField()}
                    </Col>
                </Row>
            }
            return renderJobTitleField()
        }
        return (
            <>
                {renderJobTitle()}
                {renderDepartmentField()}
                {renderOrganizationField()}
                {renderPrimaryFundingSource()}
                {renderLocation()}
            </>
        );
    }

    function renderUserNutshellViewEmpty() {
        return (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No User Profile" />
        );
    }

    function renderSection(title: string, body: string | undefined | JSX.Element) {
        return <div className="Profile-section">
            <div className="Profile-section-title">
                {title}
            </div>
            <div className="Profile-section-body">
                {body}
            </div>
        </div>;
    }

    function renderJobTitleView() {
        if (props.profileView.profile.userdata.jobTitle) {
            renderSection('position',
                props.profileView.profile.userdata.jobTitle === 'Other' ? props.profileView.profile.userdata.jobTitleOther : props.profileView.profile.userdata.jobTitle
            )
        }
    }

    function renderLocationSection() {
        const { profileView: { profile } } = props;
        const location = (() => {
            if (profile.userdata.country === 'United States') {
                return [profile.userdata.country, profile.userdata.state, profile.userdata.city].filter(x => x).join(', ');
            } else {
                return [profile.userdata.country, profile.userdata.city].filter(x => x).join(', ');
            }
        })();

        if (!location) {
            return;
        }

        return renderSection('location', location);
    }

    function renderDepartmentSection() {
        if (!props.profileView.profile.userdata.department) {
            return;
        }
        return renderSection('department', props.profileView.profile.userdata.department)
    }

    function renderOrganizationSection() {
        if (!props.profileView.profile.userdata.organization) {
            return;
        }
        return renderSection('organization', props.profileView.profile.userdata.organization);
    }

    function renderFundingSourceSection() {
        if (!props.profileView.profile.userdata.fundingSource) {
            return;
        }
        return renderSection('primary funding source', props.profileView.profile.userdata.fundingSource);
    }

    function isNutshellEmpty() {
        const { profile: { userdata: { jobTitle, department, organization, fundingSource, country, state, city } } } = props.profileView;
        if (jobTitle || department || organization || fundingSource) {
            return false;
        }
        if (country === 'United States') {
            if (country || state || city) {
                return false;
            }
        } else {
            if (country || city) {
                return false;
            }
        }
        return true;
    }

    function renderUserNutshellView() {
        if (isNutshellEmpty()) {
            return renderUserNutshellViewEmpty();
        }

        return <>
            {renderJobTitleView()}
            {renderDepartmentSection()}
            {renderOrganizationSection()}
            {renderFundingSourceSection()}
            {renderLocationSection()}
        </>;
    }

    /**
     * builds User Nutshell card
     *  - Choose between the non-auth user profile  
     *    vs. editable user profile 
     *  - Return either form or plain text
     */
    function renderUserNutshell() {
        if (isEditing) {
            return renderUserNutshellEditor();
        } else {
            return renderUserNutshellView();
        }
    }

    function renderResearchStatementField() {
        return <Form.Item
            name="researchStatement"
            rules={[
                // { min: 10, message: `input must be more than ${10} characters long` },
                { max: 1000, message: `Research Statement must be less than ${1000} characters long` },
                {
                    validator: async (_, value: string) => {
                        noScriptTag(value);
                    }
                }
            ]}
        // validateStatus={this.state.status || undefined}>
        >
            <Input.TextArea
                // autoSize

                // hidden={this.props.hidden}
                // placeholder={this.props.placeHolder}
                // readOnly={this.props.readOnly}
                // maxLength={this.props.maxLength}
                // minLength={this.props.minLength}
                placeholder='A little bit about yourself and your research'
                maxLength={1000}
                rows={15}
            // onBlur={this.commit.bind(this)}
            // onPressEnter={this.commit.bind(this)}
            // onChange={this.handleOnChange.bind(this)}
            // defaultValue={this.props.defaultValue}
            />
        </Form.Item>
    }


    /**
     * builds research statement card
     *  - Choose between the non-auth user profile  
     *    vs. editable user profile 
     *  - Return either form or plain text
     */
    function renderResearchStatement() {
        let statement;
        const { profile: { userdata: { researchStatement } } } = props.profileView;
        if (!researchStatement || researchStatement === '') {
            statement = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Research Statement" />;
        } else {
            // const fixed = this.props.profileUserdata.researchStatement.replace(/\n/, '<br />');
            // statement = <p style={{ whiteSpace: 'pre' }}>{this.props.profileUserdata.researchStatement}</p>;
            marked.use({
                breaks: true,
                // the following two settings are to disable deprecation warnings.
                mangle: false,
                headerIds: false
            });
            const content = DOMPurify.sanitize(marked.parse(researchStatement));
            statement = <div dangerouslySetInnerHTML={{ __html: content }} />;
        }

        if (isEditing) {
            return renderResearchStatementField()
        } else {
            return statement;
        }
    }

    /**
     * builds affliations card
     *  - Choose between the non-auth user profile  
     *    vs. editable user profile 
     *  - Return either form or plain text
     */

    function renderAffiliationsEditor() {
        function addFirstAlert() {
            return <Alert
                type="info"
                message="No Affiliations - use the button below to add your first!"
                style={{ fontStyle: 'italic', textAlign: 'center', padding: '4px 12px', margin: '0 0 8px 0' }}
            />
        }
        return <div>
            <div className="AffiliationEditor-row" >
                <div className="AffiliationEditor-form-col">
                    <div className="AffiliationsRow">
                        <div className="AffiliationsCol" >Position</div>
                        <div className="AffiliationsCol">Organization</div>
                        <div className="AffiliationsCol">Year Started</div>
                        <div className="AffiliationsCol">Year Ended</div>
                        <div className="AffiliationsCol"></div>
                    </div>
                </div>
                <div className="AffiliationEditor-delete-col"></div>
            </div>
            <Form.List name="affiliations"  >
                {(fields, { remove, add }) => {
                    // Note, some style tweaks for the alert below in order to  match the first row of inputs.
                    return <div>
                        {fields.length === 0 ? addFirstAlert() : fields.map((field, index) => {
                            return <div className='AffiliationsRow' key={index}>
                                <div className='AffiliationsCol Profile-field-force-inline'>
                                    <Form.Item
                                        {...field}
                                        name={[index, "title"]}
                                        required={true}
                                        rules={[
                                            { required: true, message: "a job title is required" },
                                            // { min: 2, message: 'Position must be greater than 2 characters long' },
                                            {
                                                validator: async (_, value: string) => {
                                                    if (value.length <= 2) {
                                                        throw new Error('Position must be greater than 2 characters long')
                                                    }
                                                }
                                            },
                                            { max: 50, message: `Position must be less than ${50} characters long` },
                                            {
                                                validator: async (_, value: string) => {
                                                    noScriptTag(value);
                                                }
                                            }
                                        ]}
                                    >
                                        <Input
                                            type='text'
                                            maxLength={50}
                                            autoComplete='off'
                                            placeholder='Job title'
                                        />
                                    </Form.Item>
                                </div>
                                <div className='AffiliationsCol Profile-field-force-inline'>
                                    <OrganizationField name={[index, "organization"]} required={true} />
                                </div>
                                <div className='AffiliationsCol Profile-field-force-inline'>
                                    <Form.Item
                                        name={[index, "started"]}
                                        required={false}
                                        style={{ marginBottom: 0 }}
                                        rules={[
                                            {
                                                validator: async (_, rawValue: string) => {
                                                    const value = rawValue.trim();
                                                    if (!(/[0-9]{4}/.test(value))) {
                                                        throw new Error('must be a 4-digit year');
                                                    }
                                                    const year = parseInt(value, 10);
                                                    if ((year < 1900) || (year > 2100)) {
                                                        throw new Error('must be between 1900 and 2100');
                                                    }
                                                }
                                            }
                                        ]}
                                    >
                                        <Input
                                            maxLength={4}
                                            autoComplete='off'
                                            style={{
                                                width: '100%'
                                            }}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='AffiliationsCol Profile-field-force-inline'>
                                    <Form.Item
                                        name={[index, "ended"]}
                                        required={false}
                                        style={{ overflowX: 'auto', marginBottom: 0 }}
                                        rules={[
                                            {
                                                validator: async (_, rawValue: string) => {
                                                    const value = rawValue.trim();
                                                    if (value.length === 0) {
                                                        return;
                                                    }
                                                    if (!(/[0-9]{4}/.test(value))) {
                                                        throw new Error('must bea a 4-digit year');
                                                    }
                                                    const year = parseInt(value, 10);
                                                    if ((year < 1900) || (year > 2100)) {
                                                        throw new Error('must be between 1900 and 2100');
                                                    }
                                                }
                                            }
                                        ]}
                                    >
                                        <Input
                                            style={{
                                                width: '100%'
                                            }}
                                            autoComplete='off'
                                            maxLength={4}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="AffiliationsCol Profile-field-force-inline">
                                    <Button icon={<DeleteOutlined />} danger onClick={() => { remove(index) }} />
                                </div>
                            </div>
                        })}
                        <div className='AffiliationsRow'>
                            <div className='AffiliationsCol'>
                                <Button icon={<PlusOutlined />} type="primary" onClick={() => { add() }}>
                                    {fields.length === 0 ? 'Add Your First Affiliation' : 'Add Another Affiliation'}
                                </Button>
                            </div>
                        </div>
                    </div>
                }}
            </Form.List>
        </div>;
    }

    function renderAffiliationsView() {
        const affiliations = props.profileView.profile.userdata.affiliations;
        // non-empty array

        // TODO: not sure about that last case -- at least explain it
        if (!affiliations || affiliations.length === 0 || affiliations[0]['title'] === '')
            return (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Affiliations" />
            );

        return (
            <table className="LayoutTable">
                <thead>
                    <tr>
                        <th style={{ width: "30%" }}>position</th>
                        <th style={{ width: "50%" }}>organization</th>
                        <th style={{ width: "20%" }}>tenure</th>
                    </tr>
                </thead>
                <tbody>
                    {affiliations
                        .filter(affiliation => affiliation.title)
                        .map((affiliation, index) => {
                            return <tr key={index}>
                                <td>{affiliation.title}</td>
                                <td>{affiliation.organization}</td>
                                <td>{affiliation.started} - {affiliation.ended ? affiliation.ended : 'present'}</td>
                            </tr>;
                        })}
                </tbody>
            </table>
        );
    }

    function renderAffiliations() {
        if (isEditing) {
            return renderAffiliationsEditor();
        } else {
            return renderAffiliationsView();
        }
    }

    /**
     *   event Handlers
     *
     * 
     */


    // AVATAR

    function gravatarURL(gravatarHash: string, gravatarDefault: string) {
        return `https://www.gravatar.com/avatar/${gravatarHash}?s=300&amp;r=pg&d=${gravatarDefault}`;
    }

    function avatarImageSrc(avatarOption: string, gravatarDefault: string | null, gravatarHash?: string): string {
        switch (avatarOption) {
            case 'silhouette':
                // Opting out of gravatar causes this one image to be shown, in all cases.
                return nouserpic;
            case 'gravatar':
                if (!gravatarHash) {
                    // Should never occur, but may in some old test profiles.
                    return nouserpic;
                }
                return gravatarURL(gravatarHash, gravatarDefault || 'identicon');
            default:
                // should never occur, but may in some old test profiles.
                return nouserpic;
        }
    }


    // Set gravatarURL
    function avatarImageSrcView(): string {
        const { userdata: { avatarOption, gravatarDefault }, gravatarHash } = props.profileView.profile;
        return avatarImageSrc(avatarOption, gravatarDefault || null, gravatarHash);
    }

    // Set gravatarURL
    function avatarImageSrcEdit(): string {
        const { gravatarHash } = props.profileView.profile;
        return avatarImageSrc(avatarOptionWatch, gravatarDefaultWatch, gravatarHash);
    }


    function renderAvatarOptionsField() {
        return <Form.Item
            name="avatarOption"
            label="Avatar Options"
        >
            <Radio.Group>
                <Space direction="vertical">
                    {avatarOptions.map(({ value, label, description }) => {
                        return <Radio value={value} key={value}><b>{label}</b> - {description}</Radio>
                    })}
                </Space>
            </Radio.Group>
        </Form.Item>
    }

    function renderGravatarDefaultField() {
        if (avatarOptionWatch !== 'gravatar') {
            return;
        }
        const gravatarHelpLink = <a
            href="https://en.gravatar.com/site/implement/images/#default-image"
            target="_blank"
            rel="noopener noreferrer">
            generated or generic image
        </a>;
        return <>
            <Form.Item
                name="gravatarDefault"
                label="Gravatar Default"
            >
                <Select options={gravatarDefaults} />
            </Form.Item>
            <div style={{ fontStyle: 'italic' }}>
                If your email address is not registered at gravatar, the {gravatarHelpLink} you select above will be used instead.
            </div>
        </>
    }

    function renderAvatarEditor() {
        return <>
            {renderAvatarImage(avatarImageSrcEdit)}
            {renderAvatarOptionsField()}
            {renderGravatarDefaultField()}
        </>
    }

    function renderAvatarImage(srcRenderer: () => string) {
        return <Image
            style={{ maxWidth: '100%' }}
            // fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
            fallback={nouserpic}

            alt='User avatar'
            preview={false}
            src={srcRenderer()}
        />;
    }

    function renderAvatarView() {
        return renderAvatarImage(avatarImageSrcView)
    }

    function renderAvatar() {
        if (isEditing) {
            return renderAvatarEditor();
        } else {
            return renderAvatarView();
        }
    }

    function saveForm() {
        const update = formToUpdate(form.getFieldsValue())
        saveProfile(update);
    }

    function checkForm(fields?: Array<FieldData>) {
        const isValid = (() => {
            if (fields) {
                return fields.every(({ errors }) => {
                    return !errors || errors.length === 0;
                })
            }
            const fieldsError = form.getFieldsError();
            if (!fieldsError) {
                return true;
            }
            return fieldsError.every(({ errors }) => {
                return errors.length === 0;
            })
        })();

        const isTouched = form.isFieldsTouched();

        return { isValid, isTouched }
    }

    function cancelForm() {
        const { isTouched } = checkForm();
        if (isTouched) {
            const title = <div className="compact-text">
                <p>Cancel form?</p>
                <p>You will lose any changes that have been made.</p>
            </div>

            Modal.confirm({
                title,
                onOk: () => {
                    resetForm();
                    disableEditing();
                }
            });
        } else {
            resetForm();
            disableEditing();
        }
    }


    function resetForm() {
        form.resetFields();
        const { isValid, isTouched } = checkForm();

        setIsFormValid(isValid);
        setIsFormTouched(isTouched);
    }

    function onORCIDLink() {
        // open window, without much or any window decoration.
        const eventId = uuidv4();
        // const url = new URL(`${document.location.origin}#orcidlink/link`);
        // TODO: for better ergonomics in development, should be able to get the
        // kbase environment host from the config...

        const url = new URL(props.baseUrl);
        // const url = new URL(window.location.href);
        url.hash = '#orcidlink/link';

        // {id: string} is the ReturnFromWindow type expected by ORCIDLink.
        url.searchParams.set('ui_options', "hide-ui");
        url.searchParams.set('return_link', JSON.stringify({ type: 'window', origin: window.location.origin, id: eventId, label: 'User Profile' }));

        const newWindow = window.open(url.toString(), '_blank', "popup,width=1079,height=960");
        if (newWindow === null) {
            // what to do?
            // return <Alert type="error" message="Cannot open new window for linking" />
            console.error('Cannot open new window for linking');
            return;
        }

        const handleEvent = ({ data }: MessageEvent<any>) => {
            if (typeof data === 'object' && data !== null) {
                const { id } = data;
                if (eventId === id) {
                    // this.evaluate();
                    // do something here...
                    props.checkORCID(props.profileView.user.username);
                    props.fetchProfile(props.profileView.user.username);
                    if (newWindow) {
                        newWindow.close();
                        window.removeEventListener('message', handleEvent);
                    }
                }
            }

        };
        window.addEventListener('message', handleEvent);
    }

    function renderControls() {
        if (!props.profileView.editEnable) {
            return;
        }

        const warnings = (() => {
            if (props.profileView.warnings.length > 0) {
                const showWarnings = () => {
                    Modal.warning({
                        title: 'Warnings',
                        content: <List bordered dataSource={props.profileView.warnings}
                            renderItem={(warning) => {
                                return <List.Item>{warning}</List.Item>
                            }} />
                    })
                }
                return <Button type="dashed"
                    icon={<ExclamationOutlined />}
                    onClick={showWarnings}
                >Warnings</Button>
            }
        })();

        let button;
        // let bannerText;
        if (isEditing) {
            button = <Space wrap>
                <Button
                    icon={<SaveOutlined />}
                    disabled={!(isFormTouched && isFormValid)}
                    type="primary"
                    onClick={saveForm}>
                    Save
                </Button>
                <Button
                    icon={<CloseOutlined />}
                    danger
                    onClick={cancelForm}>
                    Cancel
                </Button>
                <Button
                    danger
                    disabled={!isFormTouched}
                    onClick={resetForm}>
                    Reset
                </Button>
            </Space>
            // button = <Button
            //     icon={<CloseOutlined />}
            //     danger
            //     onClick={toggleEditing}>
            //     Close Editor
            // </Button>;
            // bannerText = <span>
            //     Closing the editor returns your profile to display mode; all edits are saved as you make them.
            // </span>;
        } else {

            const orcidLinkButton = (() => {
                if (props.orcidState.status === AsyncProcessStatus.SUCCESS) {
                    if (props.orcidState.value.orcidId) {
                        return <Button disabled>ORCID Linked</Button>
                    }
                    return <Button onClick={onORCIDLink}>Link to ORCID</Button>
                }
            })();
            button = <Space wrap >
                <Button
                    icon={<EditOutlined />}
                    type="primary"
                    onClick={enableEditing}>
                    Edit Profile
                </Button>
                {orcidLinkButton}
                {warnings}
            </Space>;

            // bannerText = <span>
            // </span>;
        }

        return <div className="ButtonBar">
            <div className="ButtonBar-button">{button}</div>
            {/* <div className="ButtonBar-text">{bannerText}</div> */}
        </div>;
    }


    function renderResearchInterests() {
        if (isEditing) {
            return renderResearchInterestsEditor();
        } else {
            return renderResearchInterestsView();
        }
    }

    function renderResearchInterestsEditor() {
        return <div>
            <Form.Item
                name="researchInterests"
                style={{ marginBottom: '0' }}
            >
                <Checkbox.Group
                    style={{ width: '100%' }}
                >
                    <Row>
                        {researchInterestsList.map(({ value, label }) => {
                            return <Col span={24} key={value}>
                                <Checkbox
                                    key={value}
                                    style={{ marginLeft: '0px' }}
                                    value={value} >
                                    {label}
                                </Checkbox>
                            </Col>;
                        })}
                    </Row>
                </Checkbox.Group>
            </Form.Item>
            <Form.Item name="researchInterestsOther">
                <Input
                    placeholder='Other research interests'
                    className='margin-top-10px'
                    maxLength={50}
                />
            </Form.Item>
        </div>;
    }

    function renderResearchInterestsView() {
        const researchInterests = props.profileView.profile.userdata.researchInterests;

        if (Array.isArray(researchInterests) &&
            researchInterests.length > 0) {
            const normalized = researchInterests.map((interest) => {
                if (interest === 'Other') {
                    return props.profileView.profile.userdata.researchInterestsOther || interest;
                } else {
                    return interest;
                }
            });
            normalized.sort((a, b) => {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });

            return (
                <ul className="PrettyList" >
                    {normalized.map((interest) => {
                        return <li key={interest}>{interest}</li>;
                    })}
                </ul>
            );
        } else {
            return (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No Research Interests" />
            );
        }
    }


    function renderORCIDIcon() {
        return <Image
            src={orcidIcon}
            alt="ORCID icon"
            preview={false}
            style={{ height: '1em', marginRight: '0.25em' }} />
    }


    function renderORCIDIdLinkEdit(orcidId: string) {
        const link = <a href={`${ORCID_URL}/${orcidId}`} target="_blank" rel="noreferrer">
            {renderORCIDIcon()}
            {orcidId}
        </a>;

        const visibilityMessage = (() => {
            if (showORCIDIdWatched) {
                return <Typography.Text type="success">showing in profile</Typography.Text>
            }
            return <Typography.Text type="warning">not showing in profile</Typography.Text>
        })();


        function makeUIURL(path: string) {
            const url = new URL(props.baseUrl);
            url.hash = `${path}`;
            return url.toString();
        }

        return <div>
            <div>{link}</div>
            <div style={{ fontStyle: 'italic' }}>{visibilityMessage}</div>
            <div className="Profile-field-force-inline">
                <Form.Item name="showORCIDId" label="Display in profile?" valuePropName="checked">
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                </Form.Item>
            </div>
            <div>
                <a href={makeUIURL('orcidlink')} target="_blank" rel="noreferrer">ORCID Link Manager</a>
            </div>
        </div>

    }

    function renderORCIDIdLinkView(orcidId: string) {
        if (!props.profileView.profile.preferences?.showORCIDId.value) {
            return;
        }

        return <a href={`${ORCID_URL}/${orcidId}`} target="_blank" rel="noreferrer">
            {renderORCIDIcon()}
            {orcidId}
        </a>;
    }

    function renderORCIDId(orcidId: string | null) {
        if (isEditing) {
            if (orcidId) {
                return renderORCIDIdLinkEdit(orcidId);
            }
            const onORCIDLink = () => {
                // open window, without much or any window decoration.
                const eventId = uuidv4();
                // const url = new URL(`${document.location.origin}#orcidlink/link`);
                // TODO: for better ergonomics in development, should be able to get the
                // kbase environment host from the config...

                // TODO - fix!
                const url = new URL(props.baseUrl);
                // const url = new URL(window.location.href);
                url.hash = '#orcidlink/link';

                // {id: string} is the ReturnFromWindow type expected by ORCIDLink.
                url.searchParams.set('ui_options', "hide-ui");
                url.searchParams.set('return_link', JSON.stringify({ type: 'window', origin: window.location.origin, id: eventId, label: 'User Profile' }));

                const newWindow = window.open(url.toString(), '_blank', "popup,width=1079,height=960");
                if (newWindow === null) {
                    // what to do?
                    // return <Alert type="error" message="Cannot open new window for linking" />
                    console.error('Cannot open new window for linking');
                    return;
                }

                const handleEvent = ({ data }: MessageEvent<any>) => {
                    if (typeof data === 'object' && data !== null) {
                        const { id } = data;
                        if (eventId === id) {
                            // this.evaluate();
                            // do something here...
                            props.checkORCID(props.profileView.user.username);
                            if (newWindow) {
                                newWindow.close();
                                window.removeEventListener('message', handleEvent);
                            }
                        }
                    }

                };
                window.addEventListener('message', handleEvent);
            }

            const alertMessage = <div>
                Have an ORCID account?
                <Button size="small" style={{ display: 'inline-block', marginRight: '0.5rem' }} onClick={onORCIDLink}>Link It</Button>
                to your KBase account and show it in your profile.
            </div>
            return <Alert message={alertMessage} />
        }
        if (orcidId) {
            return renderORCIDIdLinkView(orcidId);
        }
    }

    function renderORCIDRow() {
        const { orcidState } = props;
        switch (orcidState.status) {
            case AsyncProcessStatus.NONE:
            case AsyncProcessStatus.PENDING:
                return <tr><td colSpan={2}><Spin /></td></tr>;
            case AsyncProcessStatus.ERROR:
                // TODO: improve error - propagate error code.
                return <tr><td colSpan={2}><Alert showIcon type="error" message={orcidState.error.message} /></td></tr>;
            case AsyncProcessStatus.SUCCESS:
                if (orcidState.value.orcidId && props.profileView.profile.preferences?.showORCIDId?.value || isEditing) {
                    return <tr>
                        <th>
                            ORCID iD
                        </th>
                        <td>
                            {renderORCIDId(orcidState.value.orcidId)}
                        </td>
                    </tr>
                }
        }
    }

    /**
     * Convert form values and state into a user profile update
     * data package.
     * 
     * Some notes about the user profile service here.
     * 
     * First, unlike the call to fetch the profile, which is made to the
     * user profile "bff" service, this call is directly to the user_profile service.
     * I suspect this is due to the fact that the user profile refactor 
     * which converted from JS/knockout to TS/react was initially for a viewer,
     * and later the scope was expanded to cover editing, but time constraints or 
     * simply the quite long duration of that project (6 mos or so iirc) required
     * shortcuts.
     * 
     * So the rules for submitting updates to the user profile service are ineffect here.
     * 
     * So the user profile service is essentially a lightly validated passthrough to 
     * mongodb.
     * 
     * The "user" field serves two purposes. It is used to verify that the 
     * profile being updated has the same username as the username associated with the token.
     * And it is used to update the realname and thumbnail (unused) fields.
     * 
     * The "profile" field is used to update the user profile data. The service ensures that the entire
     * profile object is not overwritten, only the top level properties. That is, it creates an update object
     * in which each field name is "profile.PROP" where prop is a top level profile field. See the UserProfileProfile
     * type, but the fields are metadata, userdata, synced, preferences, plugins, and surveydata.
     * Of these, all that we are interested in are:
     * - userdata - the actual user-controlled display fields for the profile
     * - plugins - contains plugin-level preferences - we use this to set the user profile orcid display opt-in/out.
     * 
     * Note that each of these must be provided IN THEIR ENTIRETY, due to the fact that the the user profile
     * service does not accept a dotted field path. To this end, the best strategy is to fetch the user profile
     * first, then apply any changes to userdata and plugin preferences, then send just those two back in 
     * an update object. 
     * 
     * Needless to say, this is not great, but this service has been hardly touched in nearly 10 years.
     * 
     * @param allValues 
     */

    // Okay, here is one way to model the form values (in our case).
    // export type FormUpdate = Record<string, string | Array<string> | Array<Record<string, string>>>;

    // or this


    function formToUpdate(allValues: unknown): UserProfileUpdate {

        if (typeof allValues !== 'object' || allValues === null) {
            throw new Error('The update is not an object');
        }

        // Blind Trust activated
        const formUpdate = allValues as unknown as FormData


        // Yes, I know. But we need full deep copy, and structuredClone has not been
        // around very long in 2023.
        const userdata = JSON.parse(JSON.stringify(props.profileView.profile.userdata)) as UserProfileUserdata;

        // Okay, this is a bit of a cheat, using Required, otherwise the optional keys are 
        // not recognized.
        // TODO: make or find a better KeyOfType implementation.
        // const simpleUserdataFields: Array<KeyOfType<Required<UserProfileUserdata>, string | null | Array<string>>> = [
        //     'avatarOption',
        //     'gravatarDefault',
        //     'jobTitle',
        //     'jobTitleOther',
        //     'department',
        //     'organization',
        //     'country',
        //     'state',
        //     'city',
        //     'postalCode',
        //     'fundingSource',
        //     'researchStatement',
        //     'researchInterests'
        // ]

        // const simpleFormFields: Array<KeyOfType<Required<FormData>, string | null | Array<string>>> = [
        //     'avatarOption',
        //     'gravatarDefault',
        //     'jobTitle',
        //     'jobTitleOther',
        //     'department',
        //     'organization',
        //     'country',
        //     'state',
        //     'city',
        //     'postalCode',
        //     'fundingSource',
        //     'researchStatement',
        //     'researchInterests'
        // ]



        // const nestedArrayFields = [
        //     {
        //         name: 'affiliations',
        //         fields: ['title', 'organization', 'started', 'ended']
        //     }
        // ]

        // These fields are "required". This is self-discipline, as the user profile 
        // service doesn't care. But the form requires these fields.
        userdata.avatarOption = formUpdate.avatarOption;

        if (!formUpdate.gravatarDefault) {
            delete userdata.gravatarDefault;
        } else {
            userdata.gravatarDefault = formUpdate.gravatarDefault;
        }


        if (!formUpdate.organization) {
            delete userdata.organization;
        } else {
            userdata.organization = formUpdate.organization;
        }

        if (!formUpdate.department) {
            delete userdata.department;
        } else {
            userdata.department = formUpdate.department;
        }

        if (!formUpdate.city) {
            delete userdata.city;
        } else {
            userdata.city = formUpdate.city;
        }

        if (!formUpdate.state) {
            delete userdata.state;
        } else {
            userdata.state = formUpdate.state;
        }


        if (!formUpdate.postalCode) {
            delete userdata.postalCode;
        } else {
            userdata.postalCode = formUpdate.postalCode;
        }


        if (!formUpdate.country) {
            delete userdata.country;
        } else {
            userdata.country = formUpdate.country;
        }


        if (!formUpdate.researchStatement) {
            delete userdata.researchStatement;
        } else {
            userdata.researchStatement = formUpdate.researchStatement;
        }


        if (formUpdate.researchInterests && formUpdate.researchInterests.length > 0) {
            userdata.researchInterests = formUpdate.researchInterests;
        } else {
            delete userdata.researchInterests;
        }


        if (!formUpdate.researchInterestsOther) {
            delete userdata.researchInterestsOther;
        } else {
            userdata.researchInterestsOther = formUpdate.researchInterestsOther;
        }

        if (!formUpdate.jobTitle) {
            delete userdata.jobTitle;
        } else {
            userdata.jobTitle = formUpdate.jobTitle;
        }

        if (!formUpdate.jobTitleOther) {
            delete userdata.jobTitleOther;
        } else {
            userdata.jobTitleOther = formUpdate.jobTitleOther;
        }

        if (!formUpdate.fundingSource) {
            delete userdata.fundingSource;
        } else {
            userdata.fundingSource = formUpdate.fundingSource;
        }

        if (formUpdate.affiliations && formUpdate.affiliations.length > 0) {
            // should we do more here? There is no simply way to reflect changes
            // in the affiliations array, other than, e.g., using all keys to form
            // a row identifier. In the end, probably not worth it as the form
            // values translate literally into the profile values.
            userdata.affiliations = formUpdate.affiliations.map(({ title, organization, started, ended }) => {
                const affiliation: UserProfileAffiliation = {
                    title, organization, started: parseInt(started, 10)
                }
                if (ended && ended.length) {
                    affiliation.ended = parseInt(ended);
                }
                return affiliation;
            })
        } else {
            delete userdata.affiliations;
        }



        // TODO: figure this out later.
        // for (const field of simpleUserdataFields) {
        //     if (Object.prototype.hasOwnProperty.call(allValues, field)) {
        //         if (typeof profileField === 'string' && typeof formUpdate[field] === 'string') {
        //             userdata[field] = formUpdate[field];
        //         }

        //     }
        // }

        // First we must assert the general structure.

        // Then we can pluck out the fields, one by one.
        // Not sure how defensive we should be here. I think if we
        // are careful to sync this code with the form's initial values
        // we do not need to do things like check if the property is
        // available...

        // PREFERENCES

        const preferences = props.profileView.profile.preferences || {};

        // TODO: remove if orcid is not linked.
        if (typeof formUpdate.showORCIDId === 'boolean') {
            if (hasOwnProperty(preferences, 'showORCIDId')) {
                preferences.showORCIDId = {
                    ...preferences.showORCIDId,
                    value: formUpdate.showORCIDId,
                    updatedAt: Date.now()
                }
            } else {
                preferences.showORCIDId = {
                    value: formUpdate.showORCIDId,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                }
            }
        } else if (preferences.showORCIDId) {
            // Handles case of a user without orcid link - this 
            // form field will be undefined.
            delete preferences.showORCIDId;
        }

        const update: UserProfileUpdate = {
            user: props.profileView.user,
            profile: {
                userdata,
                preferences
            }
        }

        return update
    }

    function onFieldsChange(_: Array<FieldData>, allFields: Array<FieldData>) {
        const { isValid, isTouched } = checkForm(allFields);
        setIsFormValid(isValid);
        setIsFormTouched(isTouched);
    }

    function renderOrganizations() {
        if (isEditing) {
            const message = <div>
                <p>Organizations are not editable in your profile.</p>
                <p>Please visit the <a href="/#organizations" target="_blank" rel="noopener noreferrer">Organizations page</a> to manage your Organization memberships.</p>
            </div>
            return <Alert message={message} />
        }
        return <OrgsContainer />
    }

    function onFormLoad() {
        const { isValid } = checkForm();
        setIsFormValid(isValid);
    }

    const {
        profile: {
            userdata: {
                researchInterests, researchInterestsOther, jobTitle, jobTitleOther, department, organization, country, state, city, postalCode,
                fundingSource, researchStatement, affiliations: rawAffiliations, avatarOption, gravatarDefault
            },
            preferences
        }
    } = props.profileView

    // Some adjustments.

    // Needs to be boolean for the control; defaults to false if not present
    const showORCIDId = preferences ? (preferences['showORCIDId']?.value ? true : false) : false;

    // Needs to be string for the input control.
    const affiliations = typeof rawAffiliations === 'undefined' ? {} : rawAffiliations
        .filter(({ started, title, organization }) => {
            return (title && title.length && organization && organization.length &&
                started);
        })
        .map(({
            started, ended, title, organization
        }) => {
            const affiliation: FormDataAffiliation = {
                title, organization,
                started: String(started)
            }
            if (ended) {
                affiliation.ended = String(ended);
            }
            return affiliation;

        });

    const initialValues = {
        researchInterests, researchInterestsOther, jobTitle, jobTitleOther,
        department, organization, country, state, city, postalCode,
        fundingSource, researchStatement, affiliations, avatarOption, gravatarDefault, showORCIDId
    }

    return (
        <>
            {contextHolder}
            <div className="Profile">
                <div className="Profile-control-area" style={{ marginBottom: '10px' }}>
                    {renderControls()}
                </div >
                <div className="Profile-content-area">
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={initialValues}
                        onFieldsChange={onFieldsChange}
                        // onFinish={onFormFinish}
                        onLoad={onFormLoad}
                    >
                        <Row gutter={8} >
                            <Col span={6}>
                                <Area title={props.profileView.user.realname} >
                                    <div className="ProfileAvatar">
                                        <table className="PropertyTable" style={{ alignSelf: 'center' }}>
                                            <tbody>
                                                <tr>
                                                    <th>
                                                        Username
                                                    </th>
                                                    <td>
                                                        <span data-k-b-testhook-element="username" className="ProfileAvatar-Username">{props.profileView.user.username}</span>
                                                    </td>
                                                </tr>
                                                {renderORCIDRow()}
                                            </tbody>
                                        </table>

                                        <div className="ProfileAvatar-Avatar">
                                            {renderAvatar()}
                                        </div>
                                    </div>
                                </Area>
                            </Col>
                            <Col span={6} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Area title="Research Interests">
                                    {renderResearchInterests()}
                                </Area>
                            </Col>
                            <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Area title='Organizations' scroll="auto">
                                    {renderOrganizations()}
                                </Area>
                            </Col>
                        </Row>
                        <Row gutter={8} style={{ marginTop: '1rem' }}>
                            <Col span={7} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Area >
                                    {renderUserNutshell()}
                                </Area>
                            </Col>
                            <Col span={7} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Area title='Research or Personal Statement'>
                                    {renderResearchStatement()}
                                </Area>
                            </Col>
                            <Col span={10} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Area title='Affiliations'>
                                    {renderAffiliations()}
                                </Area>
                            </Col>
                        </Row >
                    </Form>
                </div>
            </div >
        </>
    );
}

export default Profile;
