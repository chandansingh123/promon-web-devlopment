export default function login(state = [], action) {
    switch (action.type) {
        case'UPDATE_USER_TOKEN':
            return Object.assign({},state,{token:action.token})
        case'SET_USER_DETAIL':
            return Object.assign({},state,{data: action.data})        
        default:
            return state;
    }
}
