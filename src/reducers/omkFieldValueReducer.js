
import coreReducer from './coreReducer';

export default function omkFieldValues (state = {}, action) {

    if (action.module === 'omkFieldValues')
      return (coreReducer(state, action));

    return state;
}
