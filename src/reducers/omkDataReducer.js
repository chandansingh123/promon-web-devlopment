
import coreReducer from './coreReducer';

export default function omkData (state = {}, action) {
  if (action.module === 'omkData') {
    switch (action.type) {
      case 'ON_INDEXED_CHANGE':
        return Object.assign ({}, state, {
          data: {
            ...state.data, 
            [action.index]: {
              ...state.data[action.index],
              [action.field]: action.value
            }
          }
        });
      case 'DELETE':
        return Object.assign ({}, state, {
          data: {
            ...state.data,
            [action.id]: undefined
          }
        });
      case 'ADD_ROW':
        return Object.assign ({}, state, {
          data: {
            ...state.data,
            [action.uuid]: action.row
          }
        });

      case 'DELETE_SUCCESS':
        const afterDelete = state.data[action.surveyId].data.filter(d => d.meta_instanceid !== action.id);
        return Object.assign ({}, state, {
          data: {
            ...state.data,
            [action.surveyId]: {data: afterDelete}
          }
        });
      case 'UPDATE_SUCCESS':
        const afterUpdate = state.data[action.surveyId].data.map(d => {
          if (d.meta_instanceid !== action.id)
            return d;
          else
            return action.data;
        });
        return Object.assign ({}, state, {
          data: {
            ...state.data,
            [action.surveyId]: {data: afterUpdate}
          }
        });

      default:
      return (coreReducer(state, action));
    }
  }

  return state;
}
