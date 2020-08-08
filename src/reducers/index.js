import { combineReducers } from 'redux';

import map from './mapReducer';
import projects from './projectsReducer';
import projectUsers from './projectUsersReducer';
import surveys from './surveyReducer';
import filters from './filterReducer';
import overlays from './overlayReducer';
import table from './tableReducer';
import charts from './chartReducer';
import users from './usersReducer';
import tenant from './tenentReducer';
import omkSurvey from './omkSurveyReducer';
import omkData from './omkDataReducer';
import omkFieldValues from './omkFieldValueReducer';
import role from './roleReducer';
import permission from './permissionReducer';
import ui from './uiReducer';
import appSettings from './appSettingsReducer';
import popup from './popupReducer';
import session from './sessionReducer';
import household from './houseHoldReducer';
import beneficiary from './beneficiaryReducer';
import projectsSummary from './projectsSummaryReducer';
import gis from './gisReducer';
import householdDetail from './householdDetailReducer';
import eventlogs from './eventLogReducer';
import userProfile from './userProfileReducer';
import fullSurvey from './fullSurveyReducer';
import ittReports from './ittReportsReducer';
import surveyFieldValues from './surveyFieldValuesReducer';
import reports from './reportsReducer';
import reportsData from './reportsDataReducer';
import aoi from './aoiReducer';

export default combineReducers ({
  map, aoi,
  users,
  projects, projectUsers, surveys, filters, overlays,
  charts, table,
    omkSurvey, tenant, role, permission, ui, appSettings, popup, session, omkData, omkFieldValues, household, beneficiary,
    projectsSummary, gis, householdDetail, eventlogs, userProfile, fullSurvey, ittReports, surveyFieldValues, reports, reportsData });
