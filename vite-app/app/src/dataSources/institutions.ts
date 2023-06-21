import nationalLabs from './data/nationalLabsData.json';
import higherEd from './data/higherEdData.json';

export const institutions = nationalLabs.concat(higherEd) as Array<string>;
