import coreReducer from './coreReducer';

export default function permissions(state = [], action) {
    switch (action.module) {
        case'permission':
            return (coreReducer(state, action))
        default:
            return state;
    }
}
