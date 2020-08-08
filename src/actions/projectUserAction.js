import config from 'config/config';
import { fetch, clearData } from './coreAction';
import { setSession } from './sessionAction';

// Actions related to fetching of data

export const fetchUserProfile = () => fetch ('user', `${config.backend.url}/user/profile`, (_, response, dispatch) => {
    dispatch (setSession ('projects', response.projects));
    dispatch (setSession ('user', response.user));
    dispatch (setSession ('country', response.country));
    dispatch (setSession ('permissions', response.permissions));
  }
);

export const fetchUserProjects = () => fetch ('project', `${config.backend.url}/user/projects`);

export const fetchUserEventLogs = (projectCode) => fetch ('eventlogs', `${config.backend.url}/user/projects/${projectCode}/eventlogs`);

export const fetchUserReports = (projectCode) => fetch ('reports', `${config.backend.url}/user/projects/${projectCode}/reports`);

export const fetchUserSurveys = (projectCode) => fetch ('surveys', `${config.backend.url}/user/projects/${projectCode}/surveys`);

export const fetchUserSurveyFieldValues = (projectCode, surveyId) =>
  fetch ('surveyFieldValues', `${config.backend.url}/user/projects/${projectCode}/surveys/${surveyId}/field-values`);

export const fetchUserOverlays = (projectCode) => fetch ('overlays', `${config.backend.url}/user/projects/${projectCode}/overlays`);

export const fetchUserFilters = (projectCode) => fetch ('filters', `${config.backend.url}/user/projects/${projectCode}/filters`);

export const fetchUserUsers = (projectCode) => fetch ('projectUsers', `${config.backend.url}/user/projects/${projectCode}/users`);

export const fetchUserGeojson = (projectCode) => fetch ('geojson', `${config.backend.url}/user/projects/${projectCode}/geojson`, baselineGeojsonReceived);

const baselineGeojsonReceived = (module, geojson, dispatch) => dispatch ({ type: 'BASELINE_GEOJSON_RECEIVED', module, geojson });

export const fetchUserSurveyGeojson = (projectCode, surveyId) =>
  fetch (
    'users',
   `${config.backend.url}/user/projects/${projectCode}/surveys/${surveyId}/geojson`,
   (module, geojson, dispatch) => dispatch ({ type: 'GEOJSON_RECEIVED', module, surveyId, geojson })
  );

export const fetchUserHouseHoldSummary = (projectCode, householdId) => fetch('household', `${config.backend.url}/user/projects/${projectCode}/households/${householdId}/popup-summary`);

export const fetchUserHouseHoldDetail = (countryCode, projectCode, householdId) =>
  fetch('householdDetail', `${config.backend.url}/user/${countryCode}/projects/${projectCode}/households/${householdId}/details`);


// Actions related to clearing of data

export const clearUserProjects = () => clearData ('project');

export const clearUserEventLogs = () => clearData ('eventlogs');

export const clearUserSurveys = () => clearData ('surveys');

export const clearUserOverlays = () => clearData ('overlays');

export const clearUserFilters = () => clearData ('filters');

export const clearUserUsers = () => clearData ('projectUsers');

export const clearUserGeojson = () => clearData ('geojson');

export const clearUserCharts = () => clearData ('charts');

export const clearUserReports = () => clearData ('reports');
