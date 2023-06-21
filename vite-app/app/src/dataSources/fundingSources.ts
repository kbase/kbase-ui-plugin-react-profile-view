import fundingSourcesData from './data/fundingSourcesData.json';



export const fundingSources = fundingSourcesData.map((fundingSource: string) => {
    return {
        label: fundingSource,
        value: fundingSource
    };
});