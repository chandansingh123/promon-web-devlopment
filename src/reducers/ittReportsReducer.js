import coreReducer from './coreReducer';

export default function fullSurvey(state = [], action) {
  if (action.module === 'ittReports') {
    return coreReducer (state, action);
  } else {
    return state;
  }
}
