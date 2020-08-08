
export default function beneficiary (state = [], action) {
  if (action.module === 'beneficiary' && action.type === 'DATA_RECEIVED') {
    return {...state,
      data: {
        [action.data.id]: action.data.surveys,
        ...state.data
      }
    };
  }
  return state;
}
