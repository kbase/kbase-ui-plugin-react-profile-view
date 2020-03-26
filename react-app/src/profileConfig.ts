/**
 * some of these can be found in 
 * kbase-ui-plugin-auth2-client/src/plugin/iframe_root/resources/dataSources/
 * modified some of them to make dealing with ant design a bit easier.
 */


export interface ListItem {
    value: string;
    label: string;
}

export const researchInterestsList: Array<ListItem> = [
    { "value": "Genome Annotation", "label": "Genome Annotation" },
    { "value": "Genome Assembly", "label": "Genome Assembly" },
    { "value": "Microbial Communities", "label": "Microbial Communities" },
    { "value": "Comparative Genomics", "label": "Comparative Genomics" },
    { "value": "Expression", "label": "Expression" },
    { "value": "Metabolic Modeling", "label": "Metabolic Modeling" },
    { "value": "Read Processing", "label": "Read Processing" },
    { "value": "Sequence Analysis", "label": "Sequence Analysis" },
    { "value": "Utilities", "label": "Utilities" },
    { "value": "Other", "label": "Other" }
];

export const jobTitles: Array<ListItem> = [
    { "value": "CEO", "label": "CEO" },
    { "value": "CSO", "label": "CSO" },
    { "value": "Scientific Director", "label": "Scientific Director" },
    { "value": "Principal Investigator", "label": "Principal Investigator" },
    { "value": "Co-investigator", "label": "Co-investigator" },
    { "value": "Staff Scientist", "label": "Staff Scientist" },
    { "value": "Research Associate", "label": "Research Associate" },
    { "value": "Postdoctoral Scientist", "label": "Postdoctoral Scientist" },
    { "value": "Graduate Student", "label": "Graduate Student" },
    { "value": "Undergraduate Student", "label": "Undergraduate Student" },
    { "value": "Assistant Professor", "label": "Assistant Professor" },
    { "value": "Associate Professor", "label": "Associate Professor" },
    { "value": "Professor", "label": "Professor" },
    { "value": "Physician", "label": "Physician" },
    { "value": "Other", "label": "Other" }
];

