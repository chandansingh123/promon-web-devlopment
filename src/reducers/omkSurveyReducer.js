import coreReducer from './coreReducer';

export default function omkSurvey (state = {}, action) {

    if (action.module === 'omkSurvey') {
      switch (action.type) {
        case 'UPLOAD_COMPLETED':
          return {
            ...state,
            uploadSuccess: true
          };
          case 'UPLOAD_STARTING':
          return {
            ...state,
            uploadSuccess: false
          };
        default:
          return (coreReducer(state, action));
      }
    }

    return state;
}
