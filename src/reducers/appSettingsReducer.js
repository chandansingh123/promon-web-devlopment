import coreReducer from './coreReducer';

export default function appSettings (state = [], action) {
    if (action.module === 'appSettings') {
        return coreReducer (state, action);
    }else{
        return state;
    }
}
