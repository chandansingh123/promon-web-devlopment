import coreReducer from './coreReducer';

export default function reports(state = {}, action) {
  if(action.module === 'reports') {
    return coreReducer(state, action);
  } else
    return state;
}
