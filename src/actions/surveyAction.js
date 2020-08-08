import request from 'superagent';

import config from 'config/config';
// import { downloadSurvey } from './tableAction';
import { fetch, emptyData,
    onIndexedChange, addRow, removeRow,
    addStart, addCancel, formFieldChange, addFinish, editStart, updateFinish, _delete, formSwitchToggle} from './coreAction';

const module = 'surveys';
const url = `${config.backend.url}/projects/`;

const surveysReceived = data => ({ type:'DATA_RECEIVED', module: 'surveys', data });


const surveyFetchError = ( message) => ({type:'SURVEY_FETCH_ERROR', message})


export const fetchSurveys = (projectCode, downloadGeoJson=true) => fetch (module, `${url}${projectCode}/surveys/`);

export function fetchAllSurveys(projectCode, downloadGeoJson=true){
    const token = localStorage.getItem('token');
    return function(dispatch){
        dispatch(surveyFetchStart());
        return request.get(`${config.backend.url}/projects/${projectCode}/surveys/`)
            .set('Authorization',`Token ${token}`)
            .end((error,response) => {
                if(!error && response){
                    const surveys = response.body.map (s => fixJoin (s));
                    dispatch(surveysReceived(surveys));
                    // const baseline = response.body.filter((survey) => (survey.baseline === true))[0];
                    // if (baseline) {
                    //     dispatch (downloadSurvey (projectCode, baseline.id, downloadGeoJson));
                    // }
                }else{
                    dispatch(surveyFetchError('There was an error while downloading surveys. Please contact system admin'));
                    console.log(`There was an error while downloading ${projectCode} surveys`);
                 }
            })
    }
}

function fixJoin (survey) {
  const joins = survey.join.map (j => {
    const tableR = j.tableR;
    const fields = survey.fields.filter (sf => (sf.omk_survey === tableR && !!sf.psf_id)).map (sf => sf.value);
    return {...j, columns: fields};
  });
  survey.join = joins;
  return survey;
}

export function toggleSurveyEdit(){
    return{
        type: 'TOGGLE_SURVEY_EDIT'
    }
}

export const toggleOverlayEdit = ()=>({
    type:'TOGGLE_OVERLAY_EDIT'
})

export const surveyFetchStart = () => ({
    type:'SURVEY_FETCH_START'
});

// Functions related to editing

export const formFieldChangeSurvey = (field, value) => formFieldChange (module, field, value);

export const formSwitchToggleSurvey = (field) => formSwitchToggle(module, field);

const emptySurveyData = {
  name: '',
  baseline:false,
  filter:[],
  join: []
};

export const addSurveyStart = (projectCode) => addStart (module, {...emptySurveyData, project: projectCode, editing: true});

export const surveyEditCancel = () => addCancel(module, emptySurveyData);

export function editStartSurvey (id, { data }) {
  return function (dispatch) {

    // Start Editing event
    dispatch (editStart(module, id));

    // Download the field values for each filter field
    data.filter.forEach ((f, index) => {
      const surveyField = data.fields.filter (field => field.value === f.field)[0];
      const url = `${config.backend.url}/surveys/${data.omk_survey}/field/${surveyField.id}/field-values/`;
      dispatch (fetch (module, url, function (module, data) {
        dispatch (onIndexedChange (module, 'filter', index, 'values', data));
      }));
    });
  }
}

export const addFinishSurvey = (projectCode, data) => addFinish(module, data, `${url}${projectCode}/surveys/`);

export const editFinishSurvey = (projectCode, id, data) => updateFinish(module, data, `${url}${projectCode}/surveys/${id}/`, emptySurveyData);

// export const updateUser = (data) => updateFinish(module, data, `${url+data.id}/`);

export const deleteSurvey = (projectCode, id) => _delete(module, id, `${url+projectCode}/surveys/${id}/`);

export const fetchFilterSurveyFieldValue = (surveyId, surveyFieldId, prevFieldObj={}, index) => {
    const token = localStorage.getItem('token');
    return function(dispatch){
        return request.get(`${config.backend.url}/surveys/${surveyId}/field/${surveyFieldId}/field-values/`)
            .set('Authorization',`Token ${token}`)
            .end((error,response) => {
                if(!error && response){
                    let newFieldObj = {...prevFieldObj};
                    newFieldObj[surveyFieldId] = response.body;
                    dispatch(formFieldChange (module, 'filterFieldValue',newFieldObj))
                }else{
                    console.log("There is an error while downloading survey field values for ")
                }
            })
    }
}

export const surveyFormSurveyFieldOnChange = (field, value, index) => {
    return {
        type:'SURVEY_FORM_FIELD_CHANGE',
        field,
        value,
        index
    }
}

export const surveyFormSurveyFieldToggle = (field, index) => {
    return {
        type:'SURVEY_FORM_FIELD_TOGGLE',
        field,
        index
    }
}

export function onIndexedChangeSurvey (field, index, childField, value, aux) {
  return function (dispatch) {
    dispatch (onIndexedChange (module, field, index, childField, value));

    // If filter field is changed, need to download all possible values
    if (field === 'filter' && childField === 'field') {
      const { data } = aux;
      const selected = data.fields.filter (f => f.value === value)[0];
      const url = `${config.backend.url}/surveys/${data.omk_survey}/field/${selected.id}/field-values/`;
      dispatch (fetch (module, url, function (module, data) {
        dispatch (onIndexedChange (module, field, index, 'values', data));
      }));
    }
  }
}

export const addRowSurvey = (field) => addRow (module, field, {fieldL: '', tableL: '', fieldR: '', tableR: '', columns: []});

export const removeRowSurvey = (field, index) => removeRow (module, field, index);

const featuresReceived = (surveyId, features) => ({module, type: 'FEATURES_RECEIVED', surveyId, features});

export function downloadGeojson (projectCode, surveyId) {
  return function (dispatch) {
    dispatch (surveyFetchStart ());

    const token = localStorage.getItem("token");
    const url = `${config.backend.url}/user/projects/${projectCode}/surveys/${surveyId}/geojson`;
    return request.get (url)
        .set ('Authorization',`Token ${token}`)
        .end ((error, response) => {
          if (!error && response) {
            const properties = response.body.features.map (f => f.properties);

            const indices = {};
            properties.forEach ((pr, index) => indices[pr._id] = index );

            dispatch (featuresReceived (surveyId, {properties, indices}));
          } else {
            console.log("Could not fetch survey GeoJSON for survey: "+surveyId);
          }
      });
  }
}

export const emptyDataSurvey = () => emptyData (module);
