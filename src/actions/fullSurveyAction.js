
import config from 'config/config';

import {
  formSwitchToggle, onIndexedChange, formFieldChange,
  addStart, addFinish, addCancel, updateFinish,
  _delete, fetch
} from './coreAction';

const module = 'fullSurvey';

export const onChangeFullSurvey = (field, value) => formFieldChange (module, field, value);

export const onToggleFullSurvey = (field) => formSwitchToggle (module, field);

export const addFullSurvey = (projectCode, data) => addFinish(module, data, `${config.backend.url}/projects/${projectCode}/fullsurveys`);

export const updateFullSurvey = (projectCode, data) => updateFinish(module, data, `${config.backend.url}/projects/${projectCode}/fullsurveys/${data.id}`);

export const addCancelFullSurvey = _ => addCancel (module, {});

export const addStartFullSurvey = _ => addStart (module, {editing: true});

export const editStartFullSurvey = (projectCode, id) => fetch(module, `${config.backend.url}/projects/${projectCode}/fullsurveys/${id}`);

export const onIndexedChangeFullSurvey = (field, index, childField, value) => onIndexedChange (module, field, index, childField, value);

export const removeFullSurvey = (projectCode, id) => _delete('surveys', id, `${config.backend.url}/projects/${projectCode}/fullsurveys/${id}`);
