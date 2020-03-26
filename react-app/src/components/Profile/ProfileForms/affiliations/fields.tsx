import { Affiliation } from "../../../../redux/interfaces";

export const MIN_AFFILIATION_DATE = 1900;
export const MAX_AFFILIATION_DATE = 2300;

export const MIN_ORGANIZATION_CHARS = 2;
export const MAX_INSTITUTIONS_TO_SHOW = 30;

enum ValidationStatus {
    NONE = '',
    ERROR = 'error',
    SUCCESS = 'success',
    WARNING = 'warning',
    VALIDATING = 'validating'
}

export default abstract class Field<RawType, T> {
    status?: ValidationStatus;
    message?: string;
    editState: AffiliationEditState;
    value: T;
    rawValue: RawType;
    constructor(initialValue: T, editState: AffiliationEditState) {
        this.value = initialValue;
        this.rawValue = this.valueToRaw(initialValue);
        this.editState = editState;
        // this.validate();
    }
    setValidating(): ValidationStatus.VALIDATING {
        this.status = ValidationStatus.VALIDATING;
        this.message = '';
        return this.status;
    }
    setError(message: string): ValidationStatus.ERROR {
        this.status = ValidationStatus.ERROR;
        this.message = message;
        return this.status;
    }
    setSuccess(): ValidationStatus.SUCCESS {
        this.status = ValidationStatus.SUCCESS;
        this.message = '';
        return this.status;
    }
    isError(): boolean {
        return this.status === ValidationStatus.ERROR;
    }
    update(newValue: RawType) {
        this.rawValue = newValue;
        this.validate();
    }
    commit() {
        if (this.status === ValidationStatus.SUCCESS) {
            this.editState.commit();
        }
    }

    abstract rawToValue(rawValue: RawType): T;
    abstract valueToRaw(value: T): RawType;
    validate(): ValidationStatus {
        const result = this.onValidate();
        // this.editState.validate();
        return result;
    }

    abstract onValidate(): ValidationStatus;
}

class TitleField extends Field<string, string> {
    rawToValue(rawValue: string): string {
        return rawValue;
    }
    valueToRaw(value: string): string {
        return value;
    }
    onValidate(): ValidationStatus {
        let newValue: string;
        try {
            newValue = this.rawToValue(this.rawValue);
        } catch (ex) {
            return this.setError(`Error transforming ${ex.message}`);
        }
        if (newValue.length === 0) {
            return this.setError('Title is required');
        }
        if (newValue.length < 2) {
            return this.setError('Title must be at least 2 characters long');
        }
        if (newValue.length >= 100) {
            return this.setError('Title must no more than 100 characters long');
        }
        this.value = newValue;
        return this.setSuccess();
    }
}

class OrganizationField extends Field<string, string> {
    rawToValue(rawValue: string): string {
        return rawValue;
    }
    valueToRaw(value: string): string {
        return value;
    }
    onValidate(): ValidationStatus {
        let newValue: string;
        try {
            newValue = this.rawToValue(this.rawValue);
        } catch (ex) {
            return this.setError(`Error transforming ${ex.message}`);
        }
        if (newValue.length === 0) {
            return this.setError('Organization is required');
        }
        if (newValue.length <= MIN_ORGANIZATION_CHARS) {
            return this.setError(`Organization must be at least ${MIN_ORGANIZATION_CHARS} characters long`);
        }
        if (newValue.length >= 100) {
            return this.setError('Organization must no more than 100 characters long');
        }
        this.value = newValue;
        return this.setSuccess();
    }
}

class StartedField extends Field<number, number> {
    rawToValue(rawValue: number): number {
        return rawValue;
    }
    valueToRaw(value: number): number {
        return value;
    }
    onValidate(): ValidationStatus {
        let newValue: number;
        try {
            newValue = this.rawToValue(this.rawValue);
        } catch (ex) {
            return this.setError(`Error transforming ${ex.message}`);
        }
        // if (isNaN) {

        // }
        const thisYear = new Date().getFullYear();
        const endYear = this.editState.ended;
        if (endYear.value) {
            if (thisYear > endYear.value) {
                return this.setError(`The start year must be less than or equal to the end year (${endYear.value})`);
            }
        }
        if (newValue > thisYear) {
            return this.setError(`The start year must be less than or equal to the current year (${thisYear})`);
        }
        if (newValue < MIN_AFFILIATION_DATE) {
            return this.setError(`The start year must be greater than ${MIN_AFFILIATION_DATE}`);
        }
        this.value = newValue;
        return this.setSuccess();
    }
}

class EndedField extends Field<number | undefined, number | null> {
    rawToValue(rawValue: number | undefined): number | null {
        return rawValue || null;
        // if (!rawValue) {
        //     return null;
        // }
        // return parseInt(String(rawValue));
    }
    valueToRaw(value: number): number {
        return value;
    }
    onValidate(): ValidationStatus {
        let newValue: number | null;
        try {
            newValue = this.rawToValue(this.rawValue);
            if (newValue !== null) {
                newValue = parseInt(String(newValue));
            }
        } catch (ex) {
            return this.setError(`Error transforming ${ex.message}`);
        }

        if (newValue === null) {
            this.value = null;
            return this.setSuccess();
        }

        const thisYear = new Date().getFullYear();

        if (newValue > thisYear) {
            return this.setError(`The end year must be less than or equal to the current year (${thisYear})`);
        }
        if (newValue < this.editState.started.value) {
            return this.setError(`The end year must be greater than the start year (${this.editState.started.value})`);
        }
        this.value = newValue;
        return this.setSuccess();
    }
}

export class AffiliationEditState {
    title: TitleField;
    organization: OrganizationField;
    started: StartedField;
    ended: EndedField;
    onAllValid: (affiliation: Affiliation) => void;
    onCommit: (affiliation: Affiliation) => void;
    constructor(affiliation: Affiliation, onAllValid: (affiliation: Affiliation) => void, onCommit: (affiliation: Affiliation) => void) {
        this.title = new TitleField(affiliation.title, this);
        this.organization = new OrganizationField(affiliation.organization, this);
        this.started = new StartedField(affiliation.started, this);
        this.ended = new EndedField(affiliation.ended, this);
        this.onAllValid = onAllValid;
        this.onCommit = onCommit;

        this.title.validate();
        this.organization.validate();
        this.started.validate();
        this.ended.validate();

        console.log('constructed...', this.title);
    }

    isValid(): boolean {
        if (this.title.isError() || this.organization.isError() || this.started.isError() || this.ended.isError()) {
            return false;
        }
        return true;
    }

    validate() {
        console.log('validating form...', this.title);
        if (this.title.isError() || this.organization.isError() || this.started.isError() || this.ended.isError()) {
            console.warn('all fields NOT valid');
        } else {
            console.log('all fields valid...');
            this.onAllValid({
                title: this.title.value,
                organization: this.organization.value,
                started: this.started.value,
                ended: this.ended.value
            });
        }

        // this.title.validate();
        // this.organization.validate();
        // this.started.validate();
        // this.ended.validate();
    }

    commit() {
        console.log('commiting form...', this.title);
        if (this.title.isError() || this.organization.isError() || this.started.isError() || this.ended.isError()) {
            console.warn('all fields NOT valid, not committing');
        } else {

            const affiliation = {
                title: this.title.value,
                organization: this.organization.value,
                started: this.started.value,
                ended: this.ended.value
            };
            console.log('all fields valid, committing...', affiliation, this.title);
            this.onCommit(affiliation);
        }
    }

    getValue(): Affiliation {
        return {
            title: this.title.value,
            organization: this.organization.value,
            started: this.started.value,
            ended: this.ended.value
        };
    }
}