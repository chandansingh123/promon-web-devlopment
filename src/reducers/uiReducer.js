
export default function ui (state = [], action) {
  switch (action.type) {
    case 'SET_UI':
      console.log('UI state: ', Object.assign ({}, state, {[action.field]: action.value}));
      return Object.assign ({}, state, {[action.field]: action.value});
    case'TOGGLE_DISPLAY_ACCOUNT_TOOL_TIP':
      return Object.assign({}, state, {displayAccountToolTip: !state.displayAccountToolTip});
    // case 'TOGGLE_DISPLAY_PROJECT_SUMMARY':
    //   return Object.assign({}, state, { displayProjectSummary: !state.displayProjectSummary });
    // case 'TOGGLE_MAP_POP_UP':
    //   return Object.assign({}, state, {displayMapSummary: action.bool});
    default:
      return state;
  }
}
