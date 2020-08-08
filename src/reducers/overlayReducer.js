import coreReducer from './coreReducer';

export default function overlay (state = [], action) {

  if (action.module === 'overlays') {
    switch (action.type) {
      case 'VALUES_RECEIVED':
        return Object.assign ({}, state, {
          data: {...state.data,
            [action.overlayId]: {...state.data[action.overlayId], values: action.data}
          }
        });
      default:
        return coreReducer(state, action);
    }
  }

  return state;
}
