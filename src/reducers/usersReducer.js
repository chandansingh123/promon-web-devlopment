import coreReducer from './coreReducer';

export default function login(state = [], action) {
    switch (action.module) {
        case'users':
            return (coreReducer(state, action))
        default:
            return state;
    }
}
