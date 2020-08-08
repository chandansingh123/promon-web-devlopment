
import coreReducer from './coreReducer';

export default function surveys(state = [], action) {
  if (action.module !== 'surveys')
    return state;

  switch (action.type) {
    case 'FEATURES_RECEIVED':
      return Object.assign ({}, state, {
        data: {
          ...state.data,
          [action.surveyId]: {...state.data[action.surveyId], features: action.features }
        }
      });
    default:
      return coreReducer (state, action);
  }
}
