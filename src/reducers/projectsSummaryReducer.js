import coreReducer from './coreReducer';

export default function projectsSummary (state = {}, action) {
    if (action.module === 'projectsSummary') {
        return coreReducer (state, action);
    } else {
        return state
    }
}
