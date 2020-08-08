
import {createStore, applyMiddleware,compose} from 'redux';
import thunk from 'redux-thunk';

import reducers from 'reducers';

export const chartEmptyState = {
  title: '',
  subTitle: '',
  type: 'pie',
  width: 1,
  height: 1,
  survey: '',
  surveyFields: [{value:'', type:'', label:'', color: '' }, {value:'', type:'', label:'', color: '' }],
  surveyFieldValues:[[], []],
  filters:[],
  color: '#000000',
  chartData: {}
};

export const userEmptyState = {
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  is_active: false,
  is_admin: false
};

export const roleEmptyState = {name: ''};

const omkSurveyEmptyState = {name: ''};

const projectEmptyState = {
  name: '',
  code: '',
  location: '',
  is_active: true,
  survey_type: true,
  project_map: true
};

const surveyEmptyState = {name: ''};

export const overlayEmptyState = {alias: ''};

export const filterEmptyState = {alias: ''};

const popupEmptyState = {label: ''};

export const tenantEmptyState = {
  name: '', code: '', min_longitude: '0', min_latitude: '0', max_longitude: '0', max_latitude: '0',
  first_name: '', middle_name: '', last_name: '', email: ''
};

export const fullSurveyEmptyState = {
  name: '', baseline: false
};

var initialState = {

  // State related to domain data
  appSettings:       { data: {}, isFetching: false, newData: {} },
  tenant:            { data: {}, isFetching: false, newData: tenantEmptyState },
  users:             { data: {}, isFetching: false, newData: userEmptyState },
  projectUsers:      { data: {}, isFetching: false, newData: userEmptyState },
  role:              { data: {}, isFetching: false, newData: roleEmptyState },
  permission:        { data: {}, isFetching: false },
  omkSurvey:         { data: {}, isFetching: false, newData: omkSurveyEmptyState },
  omkData:           { data: {}, isFetching: false, newData: {} },
  omkFieldValues:    { data: {}, isFetching: false, newData: {} },
  projects:          { data: {}, isFetching: true,  newData: projectEmptyState, editMode: false, projectAddErrorMessage: [] },
  surveys:           { data: {}, isFetching: false, newData: surveyEmptyState, editMode: false, surveyAddErrorMessage: [] },
  surveyFieldValues: { data: {}},
  filters:           { data: {}, isFetching: false, newData: filterEmptyState, editMode: false, surveyFields: [], addEditErrorMessage: [] },
  overlays:          { data: [], isFetching: false, newData: overlayEmptyState, editMode: false, surveyFields: [], overlayAddErrorMessage:[] },
  popup:             { data: {}, isFetching: false, newData: popupEmptyState},
  charts:            { data: {}, isFetching: false, newData: chartEmptyState, editMode: false },
  household:         { data: {}, isFetching: false, newData: {}},
  beneficiary:       { data: {}, isFetching: false },
  projectsSummary:   { data: {}, isFetching: false },
  gis:               { data: {} },
  householdDetail:   { data: {}, isFetching: false },
  eventlogs:         { data: {}, isFetching: false },
  reports:           { data: {}, isFetching: false, newData: {} },
  reportsData:       { data: {}, isFetching: false, newData: {} },

  fullSurvey:        { data: {}, newData: fullSurveyEmptyState},

  // State related to reports
  ittReports:        { data: {}, newData: {}},

  // State related to current session
  session: {},
  ui: {},

  // State related to user profile
  userProfile: {newData: {}},

  map:{
    baseline: null,
    baseLayers:[],
    overlays:[],
    filters: [],
    overlayColors:{},
    layerUrl:{},
    searchValue:'',
    autoCompleteValue:{},
    projectSummary:{},
    featuresCache:{},
    isFetching: true
  },
  table:{
    data:[],
    survey:'',
    surveyFields:[]
  },
  aoi: {}
}

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;


const enhancer = composeEnhancers(
  applyMiddleware(thunk)
);

const store=createStore(reducers, initialState, enhancer);

export default store;
