import coreReducer from './coreReducer';

export default function popup (state = [], action) {
  if (action.module === 'popup') {
    switch (action.type) {
      case 'ON_INDEXED_CHANGE':
        return indexedChange (state, action);
      default:
        return coreReducer (state, action);
    }
  }
  return state;
}


function indexedChange (state, action) {
  if (action.field === 'columns') {
    return Object.assign ({}, state, {
      ...state,
      current: {
        ...state.current,
        columns: [
          ...state.current.columns.slice (0, action.index),
          {...state.current.columns[action.index], [action.childField]: action.value},
          ...state.current.columns.slice (action.index + 1)
        ]
      }
    });
  } else {
    return Object.assign ({}, state, {
      ...state,
      current: {
        ...state.current,
        images: [
          ...state.current.images.slice (0, action.index),
          {...state.current.images[action.index], [action.childField]: action.value},
          ...state.current.images.slice (action.index + 1)
        ]
      }
    });
  }
}
