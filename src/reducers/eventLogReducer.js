import coreReducer from './coreReducer';

export default function eventlogs (state = [], action) {

  if (action.module === 'eventlogs') 
    return coreReducer(state, action);
  else
    return state;
}
