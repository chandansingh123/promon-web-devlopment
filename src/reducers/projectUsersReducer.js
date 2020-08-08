import coreReducer from './coreReducer';

export default function projectUsers (state = {}, action) {
  if (action.module === 'projectUsers') {
    return coreReducer (state, action);
  } else {
    return state;
  }
}
