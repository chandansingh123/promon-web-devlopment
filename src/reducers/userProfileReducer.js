
import coreReducer from './coreReducer';

export default function userProfile(state = {}, action) {
  if (action.module !== 'userProfile')
    return state;
  switch (action.type) {
    case 'LOAD_USER_PROFILE':
      return Object.assign ({}, state, {
        newData: {...action.data, original_password: '', new_password: '', confirm_password: ''}
      });
    case 'UPDATE_SUCCESS':
      return state;
    default:
      return coreReducer (state, action);
  }
}
