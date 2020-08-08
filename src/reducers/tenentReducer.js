import coreReducer from './coreReducer';

export default function tenent(state = [], action) {
  if (action.module !== 'tenant')
    return state;

  switch (action.type) {
    case 'DATA_RECEIVED':
      const data = action.data.map (d => ({
        ...d,
        topLeft: `(${d.min_longitude}, ${d.min_latitude})`,
        bottomRight: `(${d.max_longitude}, ${d.max_latitude})`
      }));
      return (coreReducer(state, {...action, data}));
    case 'ADD_COMPLETED':
      action.data = {
        ...action.data,
        topLeft: `(${action.data.min_longitude}, ${action.data.min_latitude})`,
        bottomRight: `(${action.data.max_longitude}, ${action.data.max_latitude})`
      }
      return coreReducer (state, action);
    case 'UPDATE_SUCCESS':
      action.data = {
        ...action.data,
        topLeft: `(${action.data.min_longitude}, ${action.data.min_latitude})`,
        bottomRight: `(${action.data.max_longitude}, ${action.data.max_latitude})`
      }
      return coreReducer (state, action);
    default:
      return coreReducer(state, action);
  }
}
