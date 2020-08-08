
export default function session (state = {}, action) {
  switch (action.type) {
    case 'SET_SESSION':
      return Object.assign ({}, state, {
        [action.key]: action.value
      });
    default:
      return state;
  }
}
