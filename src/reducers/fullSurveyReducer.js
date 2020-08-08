import coreReducer from './coreReducer';

export default function fullSurvey(state = [], action) {
  if (action.module === 'fullSurvey') {
    switch(action.type) {
      case 'DATA_RECEIVED':
      return Object.assign({}, state ,{
        data: {...state.data, [action.data.id]: {...action.data}},
        newData: {...action.data, editing: true}
    });
      default:
      return coreReducer (state, action);
    }
  } else {
    return state;
  }
}
