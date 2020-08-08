
import request from 'superagent';

import config from 'config/config';
import { filterEmptyState } from 'store/store';
import { fetch, addStart, addCancel, addTemp, emptyData,
  valueChange, formFieldChange, addFinish, editStart, updateFinish, _delete } from './coreAction';

const module = 'filters';
const url=`${config.backend.url}/projects/`;

export const valueFilterChange = (index, value) => valueChange (module, index, value);

export const filterSubmit = () => ({type: 'FILTER_SUBMITTED', module: 'filters'});

export const fetchFilters = (projectCode) => fetch(module,`${url+projectCode}/filters/`);

export function filterFormFieldChange (field, value, surveyId, surveys, tempFlag) {
  return function (dispatch) {
    switch (field) {
      case 'column':
        dispatch (formFieldChange(module, field, value));
        let fieldValue;
        if (tempFlag)
          fieldValue = surveys.data[surveyId].fields.filter( surveyField => surveyField.id === +value)[0];
        else
          fieldValue = surveys.data[surveyId].fields.filter( surveyField => surveyField.psf_id === +value)[0];
        dispatch (formFieldChange(module, 'alias', fieldValue.label));
        dispatch (formFieldChange(module, 'name', `_${fieldValue.value}`));
        return;
      default:
        dispatch (formFieldChange(module, field, value));
    }
  }
}

export const addFilterStart = () => addStart (module, {...filterEmptyState, editing: true});

export function addTempFilter (obj, projectCode) {
  return function (dispatch) {
    const id = Date.now();
    dispatch (addTemp (module, {...obj, id: id, values: [] }));
    dispatch (getSurveyFieldValues (id, projectCode, +obj.survey, +obj.column));
  }
}

// TODO need to move to survey action handler module

function getSurveyFieldValues (filterId, projectCode, surveyId, surveyFieldId) {
  const token = localStorage.getItem('token');
  return function (dispatch) {
    request.get(`${config.backend.url}/projects/${projectCode}/surveys/${surveyId}/survey-fields/${surveyFieldId}/field-values/`)
      .set('Authorization',`Token ${token}`)
      .end((error, response) => {
        if(!error && response) {
          dispatch(surveyFieldValueReceived(filterId, response.body));
        } else {
          console.log("Could not fetch survey fields value for survey feild: "+surveyFieldId);
        }
    });
  }
}

const surveyFieldValueReceived = (filterId, data) => ({type: 'VALUES_RECEIVED', module, filterId, data});

export const filterEditCancel = () => addCancel(module, filterEmptyState);

export const editFilterStart = (id) => editStart(module, id);

export const saveFilter = (data, projectCode) => addFinish(module, data, `${url+projectCode}/filters/`, filterEmptyState);

export const updateFilter = (data, projectCode) => updateFinish(module, data, `${url+projectCode}/filters/${data.id}/`, filterEmptyState);

export const deleteFilter = (projectCode, id) => _delete(module, id, `${url+projectCode}/filters/${id}`);

export const emptyDataFilter = () => emptyData (module);
