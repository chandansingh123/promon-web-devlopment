import coreReducer from './coreReducer';

export default function project(state = [], action) {
    if (action.module === 'project') {
        return coreReducer (state, action);
    }else{
        return state
    }
}
