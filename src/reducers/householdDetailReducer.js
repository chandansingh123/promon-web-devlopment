
import coreReducer from './coreReducer';

export default function householdDetail(state = {}, action) {
  switch (action.module) {
    case 'householdDetail':
      return (coreReducer(state, action))
    default:
      return state;
  }
}
