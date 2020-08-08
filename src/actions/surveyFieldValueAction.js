
import config from 'config/config';

import { fetch } from './coreAction';

const module = 'surveyFieldValues';

export const fetchSurveyFieldValues = (projectCode, surveyId, surveyFieldId, callback) => fetch (
    module, `${config.backend.url}/projects/${projectCode}/surveys/${surveyId}/survey-fields/${surveyFieldId}/field-values/`, callback);
