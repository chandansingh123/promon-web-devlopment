
import { fetch, fetchPartial, download,
         addStart, addCancel, addStepFinish,
         editStart, formFieldChange, indexedSwitchToggle, updateFinish, onIndexedChange,
         _delete,
         simplePost
         } from './coreAction';
import config from 'config/config';

const module = 'omkSurvey';
const url = `${config.backend.url}/surveys/`;


// Functions related to fetching

export const fetchOmkSurveys = () => fetch (module, url);

export const fetchPartialOmkSurvey = (id, field) => fetchPartial (module, `${url}${id}/field/`, field);


// Functions related to add

export const addOmkSurveyStart = () => addStart (module, {name: '', editing: true});

export const addOmkSurveyCancel = () => addCancel (module, {name: ''});

export const addOmkSurveyStepFinish = (data) => addStepFinish (module, data, url);

export const editOmkSurveyStart = (id) => editStart(module, id);

export const deleteOmkSurvey = (id) => _delete(module, id, `${url+id}/`);

export const addEditOmkSurvey = (data) => updateFinish (module, data, `${url}${data.id}/`);


// Functions related to editing

export const formFieldOmkSurveyChange = (field, value) => formFieldChange (module, field, value);

export const indexedSwitchToggleOmkSurvey = (field, index) => indexedSwitchToggle (module, field, index);

export const indexedFieldChangeOmkSurvey = (field, index, childField, value) => onIndexedChange (module, field, index, childField, value);

export const downloadOmkSurvey = (omkId) => download(`${url}${omkId}/survey-file`);


// Functions related to upload

export const dataUploadOmkSurvey = (id, payload) => simplePost (`${url}${id}/import-data/`, payload, uploadCompleted);

const uploadCompleted = () => ({module, type: 'UPLOAD_COMPLETED'});

export const uploadStartingOmkSurvey = () => ({module, type: 'UPLOAD_STARTING'});