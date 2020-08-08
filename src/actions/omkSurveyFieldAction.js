
import { fetch, 
    addStart, addCancel, addStepFinish,
    formFieldChange} from './coreAction';
import config from '../config/config';

const module = 'omkSurveyField';
const url = `${config.backend.url}/surveys/`;

// Functions related to fetching

export const fetchOmkSurveysFields = (surveyId) => fetch (module, `${url}/${surveyId}/fields`);

// Functions related to editing
export const formFieldOmkSurveyChange = (field, value) => formFieldChange (module, field, value);
