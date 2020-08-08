import coreReducer from './coreReducer';

export default function filter(state = {}, action) {
  if(action.module === 'filters') {
    switch (action.type) {
      case 'VALUES_RECEIVED':
        return Object.assign ({}, state, {
          data: {...state.data,
            [action.filterId]: {...state.data[action.filterId], values: action.data}
          }
        });
      default:
        return coreReducer(state, action);
    }
  }
  return state;
}
