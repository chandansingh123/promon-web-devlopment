
import request from 'superagent';

import config from 'config/config';
import { overlayEmptyState } from 'store/store';
import { fetch, addStart, addCancel, addTemp, emptyData,
  formFieldChange, addFinish, editStart, updateFinish, _delete } from './coreAction';

const module = 'overlays';
const url=`${config.backend.url}/projects/`;

export const fetchOverlays = (projectCode) => fetch(module,`${url}${projectCode}/overlays/`);

export function overlayFormFieldChange (field, value, surveyId, surveys, tempFlag) {
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

export const addOverlayStart = () => addStart (module, {...overlayEmptyState, editing: true})

export function addTempOverlay (obj, projectCode) {
  return function (dispatch) {
    const id = Date.now();
    dispatch (addTemp (module, {...obj, id: id }));
    dispatch (getSurveyFieldValues (id, projectCode, +obj.survey, +obj.column));
  }
}

// TODO need to move to survey action handler module

function getSurveyFieldValues (overlayId, projectCode, surveyId, surveyFieldId) {
  const token = localStorage.getItem('token');
  return function (dispatch) {
    request.get(`${config.backend.url}/projects/${projectCode}/surveys/${surveyId}/survey-fields/${surveyFieldId}/field-values/`)
      .set('Authorization',`Token ${token}`)
      .end((error, response) => {
        if(!error && response) {
          dispatch(surveyFieldValueReceived(overlayId, response.body));
        } else {
          console.log("Could not fetch survey fields value for survey feild: "+surveyFieldId);
        }
    });
  }
}

const surveyFieldValueReceived = (overlayId, data) => ({type: 'VALUES_RECEIVED', module, overlayId, data});

export const overlayEditCancel = () => addCancel(module, overlayEmptyState);

export const editOverlayStart = (id) => editStart(module, id);

export const saveOverlay = (data, projectCode) => addFinish(module, data, `${url+projectCode}/overlays/`, overlayEmptyState);

export const updateOverlay = (data, projectCode) => updateFinish(module, data, `${url+projectCode}/overlays/${data.id}/`, overlayEmptyState);

export const deleteOverlay = (projectCode, id) => _delete(module, id, `${url+projectCode}/overlays/${id}/`);

export const emptyDataOverlay = () => emptyData (module);
