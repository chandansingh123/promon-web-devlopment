import coreReducer from './coreReducer';

export default function houseHold(state = [], action) {
    switch (action.module) {
        case'household':
            return (coreReducer(state, action))
        default:
            return state;
    }
}
