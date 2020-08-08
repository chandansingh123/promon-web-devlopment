
export default function gis(state = {}, action) {
  switch (action.type) {
    case 'BASELINE_GEOJSON_RECEIVED':
      return Object.assign ({}, state, {
        data: {...state.data, baseline: action.geojson }
      });
    case 'GEOJSON_RECEIVED':
      return Object.assign ({}, state, {
        data: {...state.data, [action.surveyId]: action.geojson }
      });
    default:
      return state;
  }
}
