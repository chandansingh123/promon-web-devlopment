export default function project(state = [], action) {
    switch (action.type) {
        // case 'UPDATE_CURRENT_PROJECT':
        //     return Object.assign({}, action.currentProject)
        // case 'UPDATE_INITIAL_DATA_FETCH':
        //     return Object.assign({}, state,{...state,initialDataFetch: action.status})
        default:
            return state;
    }
}
