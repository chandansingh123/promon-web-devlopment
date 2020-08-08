import coreReducer from './coreReducer';

export default function surveyFieldValues (state = [], action) {
  if (action.module === 'surveyFieldValues')
    return  coreReducer (state, action);
  else
    return state;
}
