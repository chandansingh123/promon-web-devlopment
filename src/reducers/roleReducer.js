import coreReducer from './coreReducer';

export default function role(state = [], action) {
    switch (action.module) {
        case'role':
            return (coreReducer(state, action))
        default:
            return state;
    }
}
