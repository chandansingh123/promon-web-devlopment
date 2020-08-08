
export default function aoi (state = {}, action) {
  switch(action.type) {
    case 'AOI_SET_DATA': return action.data;
    case 'AOI_UNSET_DATA': return {};
    default: return state;
  }
}
