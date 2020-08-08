
import { chartEmptyState } from 'store/store';

import coreReducer from './coreReducer';


const getChartIndexByid = (charts, id) => {
    let chartIndex;
    charts.forEach( (chart, index) => {
         if(chart.id === id)
            chartIndex = index
    });
    return chartIndex;
}

const getSurveyFieldByValue = (surveyFields, value) =>{
    return surveyFields.filter(surveyField => surveyField.value === value)
}

export default function charts (state = [], action) {
  if (action.module === 'charts') {
    switch (action.type) {
      case 'CHART_SFV_CHANGE':
        const sfv = [...state.newData.surveyFieldValues[action.index]];
        sfv[action.subIndex][action.field] = action.value;
        return Object.assign ({}, state, {
          newData: {
            ...state.newData,
            surveyFieldValues: [
              ...state.newData.surveyFieldValues.slice (0, action.index),
              sfv,
              ...state.newData.surveyFieldValues.slice (action.index + 1)
            ]
          }
        });
      case 'EDIT_STARTED':
        return Object.assign({}, state, {
            editMode: true,
            newData: {...action.id, editing: true, reset: true}
        });
      case 'ADD_COMPLETED':
        return Object.assign ({}, state , {
            data: {...state.data, [action.data.id]: action.data},
            newData: chartEmptyState
        });
      default:
        return coreReducer(state, action);
    }
  }

  switch (action.type) {
    case 'CHART_DATA_RECEIVED':
      return Object.assign ({}, state, {
        data: {
          ...state.data,
          [action.id]: {...state.data[action.id], data: action.data}
        }
      });
        case 'CHART_LIST_RECEIVED':
            return Object.assign({}, state, { data : action.charts, isFetching: false})
        case 'UPDATE_CHARTS_INITIAL_DATA_FETCH':
            return Object.assign({}, state,{ initialDataFetch: !state.initialDataFetch})
        case 'CHART_REMOVE_SUCCESS':
            const index = getChartIndexByid(state.data, action.id);
            return Object.assign({}, state, {
                data: [
                    ...state.data.slice(0, index),
                    ...state.data.slice(index + 1)
                ]});
        case 'CHART_FORM_TITLE_CHANGED':
            return Object.assign({},state,{newChart:{...state.newChart,title:action.title}})
        case 'CHART_FORM_SUB_TITLE_CHANGED':
            return Object.assign({},state,{newChart:{...state.newChart,subTitle:action.subTitle}})
        case 'CHART_FORM_TYPE_CHANGED':
            return Object.assign({},state,{newChart:{...state.newChart,type:action.chartType}})
        case 'CHART_FORM_SURVEY_FIELD_CHANGED':
            const surveyField = getSurveyFieldByValue(state.surveyFields,action.value);
            const changedSurveyField = {};
            changedSurveyField.field = action.value;
            changedSurveyField.type = surveyField[0].type;
            changedSurveyField.label = surveyField[0].label;
            return Object.assign({},state,{newChart:{...state.newChart,surveyFields:[
                ...state.newChart.surveyFields.slice(0,action.index),
                changedSurveyField,
                ...state.newChart.surveyFields.slice(action.index+1)
            ]}})
        case'CHART_FORM_SURVEY_FIELD_LABEL_CHANGED':
            const _surveyFields = state.newChart.surveyFields.slice(0);
            const __surveyField = _surveyFields[action.index];
            __surveyField.label = action.value;
            return Object.assign({},state,{newChart:{...state.newChart,surveyFields:[
                ...state.newChart.surveyFields.slice(0,action.index),
                __surveyField,
                ...state.newChart.surveyFields.slice(action.index+1)
            ]}})
        case 'UPDATE_CHART_FORM_SURVEY_FIELD_VALUE':
            const surveyFieldValue = {...state.newData.surveyFieldValues[action.index], data: action.value, isVisible: 'true'};
            return Object.assign ({}, state, {
                newData: {
                    ...state.newData,
                    surveyFieldValues:[
                        ...state.newData.surveyFieldValues.slice(0,action.index),
                        surveyFieldValue,
                        ...state.newChart.surveyFieldValues.slice(action.index+1)
                    ]
                }
            });
        case 'CHART_ADD_FILTER_FIELD_CHANGE':
            const filters = state.newData.filters.slice(0);
            const filter = filters[action.index];
            filter.field = action.value;
            return Object.assign ({}, state, {
                newData: {
                    ...state.newData,
                    filters:[
                    ...state.newData.filters.slice(0,action.index),
                    filter,
                    ...state.newData.filters.slice(action.index+1)
            ]}});
        case 'CHART_ADD_FILTER_DATA_RECEIVED':
            const _filters = state.newData.filters.slice(0);
            const _filter = _filters[action.index];
            _filter.data = action.data;
            return Object.assign ({}, state, {
                newData: {
                    ...state.newData,
                    filters: [
                        ...state.newData.filters.slice(0,action.index),
                        _filter,
                        ...state.newData.filters.slice(action.index+1)
                    ]
                }
            });
        case 'CHART_ADD_FILTER_VALUE_CHANGE':
            const __filter = {...state.newData.filters[action.index], value: action.value};
            return Object.assign ({},state,{
                newData: {
                    ...state.newData,
                    filters: [
                        ...state.newData.filters.slice(0,action.index),
                        __filter,
                    ...state.newData.filters.slice(action.index+1)
                    ]
                }
            });
        case 'RESET_NEW_CHART':
            return Object.assign ({}, state, { newData:action.newChart });
        case 'CHART_SAVE_SUCCESS':
            return Object.assign({},state,{data:[
                ...state.data,action.chart
        ]})
        case 'CHART_UPDATE_SUCCESS':
            return Object.assign({}, state, {data:[
                ...state.data.slice(0,action.index),
                action.chart,
                ...state.data.slice(action.index+1)
            ]})
        default:
            return state;
    }
}
