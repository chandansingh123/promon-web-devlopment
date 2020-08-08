import request from 'superagent';

import config from 'config/config';
import { chartEmptyState } from 'store/store';
import { chartColors } from 'store/globalObject';

import { fetch,
    indexedFieldChange, formSwitchToggle,
    addFinish, updateFinish, _delete, addStart, addCancel, formFieldChange, removeRow, addRow,
    editStart, onProgress } from './coreAction';
import { fetchSurveyFieldValues } from './surveyFieldValueAction';

const module = 'charts';
const url=`${config.backend.url}/projects/`; 


const filterFieldChange = (index, value) => ({ type:'CHART_ADD_FILTER_FIELD_CHANGE', index, value });

const filterDataReceived = (data, index) => ({ type:'CHART_ADD_FILTER_DATA_RECEIVED', data, index });

export const updateFilterData = (index,surveyFieldId, projectCode, surveyId) => {
    const token = localStorage.getItem('token');
    return function(dispatch){
        return request.get(`${config.backend.url}/projects/${projectCode}/surveys/${surveyId}/survey-fields/${surveyFieldId}/field-values/`)
            .set('Authorization',`Token ${token}`)
	        .end((error, response) => { 
	            if(!error && response){
	                dispatch(filterDataReceived(response.body, index))
	            }else{
	                console.log("Could not fetch survey fields value for survey feild: "+surveyFieldId);
	            }
	        });
    }
}

export function filterChange(index, value, surveyFieldId, projectCode, surveyId){
    return function(dispatch){
        dispatch(filterFieldChange(index, value))
        dispatch(updateFilterData(index, surveyFieldId, projectCode, surveyId))
    }
}

export function filterValueChange(index, value){
    return {
        type:'CHART_ADD_FILTER_VALUE_CHANGE',
        value,
        index
    }
}


// ACTIONS RELATED TO FETCHES

export const fetchCharts = (projectCode) => fetch(module, `${url}${projectCode}/charts/`);

export const removeChart = (projectCode, id) => _delete(module, id, `${url}${projectCode}/charts/${id}`);


// Actions related to ADDS and EDITS

export const addChartStart = () => addStart (module, {...chartEmptyState, editing: true, reset: true});

export function editStartChart (chart, surveys) {
  // Get survey fields
  const firstField = surveys[+chart.survey].fields.find (f => f.value === chart.query.field[0]);
  const secondField = chart.query.field[1] ? surveys[+chart.survey].fields.find (f => f.value === chart.query.field[1]) : {value:'', type:'', label:'', color: '' };
  const secondFieldValues = chart.options.mapping.length === 1 ? [] : Object.values (chart.options.mapping[0]);

  const newChart = {
    id:chart.id,

    survey: chart.survey,
    surveyFields: [firstField, secondField],
    surveyFieldValues: [Object.values (chart.options.mapping[0]), secondFieldValues],
    filters: [],

    title: chart.title,
    subTitle: chart.options.chartOptions.subtitle.text,
    type: chart.options.chartOptions.chart.type,
    width:chart.width,
    height:chart.height,

    color: chart.options.chartOptions.color,
    chartData: {},
  };

  return editStart (module, newChart);
}

export const saveChart = (data, projectCode) => addFinish(module, data, `${url}${projectCode}/charts/`);

export const updateChart = (data, projectCode, chartId) => updateFinish(module, data, `${url}${projectCode}/charts/${chartId}/`);


// Actions related to Value changes in Form

export const chartSfvChange = (index, subIndex, field, value) => ({type: 'CHART_SFV_CHANGE', module, index, subIndex, field, value});

export const formFieldChangeChart = (field, value) => formFieldChange (module, field, value);

export const formSwitchToggleChart = (field) => formSwitchToggle (module, field);

export const indexedFieldChangeChart = (field, index, value) => indexedFieldChange (module, field, index, value)


export function onIndexedChangeChart (field, index, value, auxiliaryInfo) {
  return function (dispatch) {
    const selected = auxiliaryInfo.fields.filter (f => f.id === Number (value))[0];
    const fieldValue = {
      value: selected.value,
      label: selected.label,
      id: selected.id
    };
    dispatch (indexedFieldChange (module, field, index, fieldValue));
    dispatch (fetchSurveyFieldValues (auxiliaryInfo.projectCode, auxiliaryInfo.surveyId, selected.id,
        ((sfvModule, surveyFieldValues) => {
          surveyFieldValues.push ({label: '', value: '', order: 0});
          surveyFieldValues.forEach ((sfv, i)  => {sfv.color = chartColors[i % 20]; sfv.value = sfv.label});
          const data = {
            data: surveyFieldValues,
            isVisible: true
          }
          dispatch (indexedFieldChange (module, 'surveyFieldValues', index, data));
        })));
  }
}

export const removeRowChart = (field, id) => removeRow (module, field, id);

export const addRowChart = (field) => addRow (module, field, {value:'', type:'', label:'', color: '' });

export const chartEditCancel = () => addCancel(module, {...chartEmptyState, editing: false, reset: true});
    
export const chartFormFieldChange = (field, value) => formFieldChange(module, field, value);

export const onProgressChart = () => onProgress (module);

export function getChartData (projectCode, chartId) {
  const token = localStorage.getItem('token');
  return function (dispatch) {
    return request.get (`${config.backend.url}/projects/${projectCode}/charts/${chartId}/`)
        .set ('Authorization',`Token ${token}`)
        .end ((error, response) => {
            if (!error && response) {
                dispatch (chartDataReceived (chartId, response.body));
            } else {
                // dispatch(fetchError(module, 'There is an error while fetching data...'))
                // handleAuthFailure (response);
            }
        })
  }
}

const chartDataReceived = (id, data) => ({ type: 'CHART_DATA_RECEIVED', id, data });

export const fetchChartSurveyData = (projectCode, surveyId, fields, callback) =>
    fetch(module, `${config.backend.url}/projects/${projectCode}/charts/preview/?field=${fields}&survey=${surveyId}`, callback);
