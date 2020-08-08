import coreReducer from './coreReducer';

export default function reportsData(state = {}, action) {
  if(action.module === 'reportsData') {
    return coreReducer(state, action);
  } else
    return state;
}
