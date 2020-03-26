import countryCodesData from './data/countryCodesData.json';

export const countryCodes = new Map(countryCodesData as Array<[string, string]>);
