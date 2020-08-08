
export default function coreReducer (state, action) {
    switch (action.type) {
    
    // Actions HACK
    case 'EMPTY_DATA':
      return Object.assign ({}, state, {
        data: {}
      });

    // Actions related to FETCH
    case 'CLEAR_DATA':
      return Object.assign ({}, state, {
        data: {}
      });
    case 'FETCH_STARTED':
      return Object.assign ({}, state, {
        isFetching: true
      });
      case 'FETCH_COMPLETED':
      return Object.assign ({}, state, {
        isFetching: false
      });
    case 'DATA_RECEIVED':
      return Object.assign ({}, state, {
        data: {...state.data, ...mappedData (action.data)},
        isFetching: false
      });
      case 'PARTIAL_DATA_RECEIVED':
      return Object.assign ({}, state, {
        newData: {...state.newData, [action.field]: action.data},
        isFetching: false
      });
    case 'FETCH_ERROR':
      return Object.assign({}, state, {
          fetchError:action.message,
          isFetching:false
      })
      
    // Actions related to add
    case 'ADD_STARTED':
      return Object.assign ({}, state, {
          newData: action.obj
      });

    case 'ADD_CANCELLED':
        return Object.assign ({}, state, {
            newData: action.obj || {},
            editMode:false
        });
    case 'ADD_COMPLETED':
        let tempData = {...state.data};
        tempData[action.data.id] = action.data;
        return Object.assign({}, state ,{
          data: tempData,
          newData: action.emptyObj || {}
        });
    case 'ADD_STEP_COMPLETED':
        return Object.assign({}, state ,{
            newData: {...state.newData, id: action.data.id}
        });
    case 'ADD_UPDATE_ERROR':
      return Object.assign ({}, state, {
        newData: {...state.newData, errors: action.data}
      });


    // ACTIONS RELATED TO VALUE CHANGES
    case 'ON_PROGRESS':
      return Object.assign ({}, state, {
        newData: {
          ...state.newData,
          reset: false
        }
      });
    case 'ON_CHANGE':
      return Object.assign ({}, state, {
        current: {
          ...state.current,
          [action.field]: action.value
        }
      });
    case 'ADD_ROW':
      return Object.assign ({}, state, {
        newData: {
          ...state.newData,
          [action.field]: [...state.newData[action.field], action.value]
        }
      });
    case 'REMOVE_ROW':
      return Object.assign ({}, state, {
        newData: {
          ...state.newData,
          [action.field]: [
            ...state.newData[action.field].slice (0, action.index),
            ...state.newData[action.field].slice ( action.index + 1)
          ]
        }
      });
    case 'FORM_FIELD_CHANGE':
      return Object.assign ({}, state, {
          newData: {
            ...state.newData,
            [action.field]: action.value,
            errors: { ...state.newData.errors, [action.field]: undefined }
          }
        });
    case 'INDEXED_FIELD_CHANGED':
      return Object.assign ({}, state, {
        newData: {...state.newData,
          [action.field]: [
            ...state.newData[action.field].slice (0, action.index),
            action.value,
            ...state.newData[action.field].slice (action.index + 1)
          ]
        }
      });
      case 'ON_INDEXED_CHANGE':
      return Object.assign ({}, state, {
        newData: {...state.newData,
          [action.field]: [
            ...state.newData[action.field].slice (0, action.index),
            {
              ...state.newData[action.field][action.index],
              [action.childField]: action.value
            },
            ...state.newData[action.field].slice (action.index + 1)
          ]
        }
      });

    // TODO - hack, only works for OMK survey
    case 'INDEXED_FIELD_CHANGE':
      return Object.assign ({}, state, {
        newData: {...state.newData, fields: [
            ...state.newData.fields.slice (0, action.index),
            {...state.newData.fields[action.index], label: action.value},
            ...state.newData.fields.slice (action.index + 1)]
        }
      });
    // TODO - hack, only works for OMK survey
    case 'INDEXED_SWITCH_TOGGLE':
      return Object.assign ({}, state, {
        newData: {...state.newData, fields: [
            ...state.newData.fields.slice (0, action.index),
            {...state.newData.fields[action.index], discrete: !state.newData.fields[action.index].discrete},
            ...state.newData.fields.slice (action.index + 1)]
        }
      });

    case 'FORM_SWITCH_TOGGLE':
      let _tempNewData = {...state.newData};  
      _tempNewData[action.field] = !state.newData[action.field];
      return Object.assign({}, state, {
          newData:_tempNewData
        });

    case 'EDIT_STARTED':
        return Object.assign({}, state, {
            editMode: true,
            newData: {...state.data[action.id], editing: true}
        });
    case 'UPDATE_SUCCESS':
        if (action.data) {
            return Object.assign({}, state ,{
                data: {...state.data, [action.data.id]: {...state.data[action.data.id], ...action.data}},
                newData: action.emptyObj || {},
                editMode: false
            });
        } else {
            return Object.assign ({}, state, {
                data: {...state.data, [state.newData.id]: state.newData},
                newData: {},
                editMode: false
            });
        }
    case 'DELETE_SUCCESS':
        let __tempData = {...state.data};
        delete __tempData[action.id];
        return Object.assign({}, state ,{data:__tempData});
    case 'ADD_CHILD_COMPLETE':
        let newData = {...state.data}
        let newObj = newData[action.id]
        newObj[action.field] = newObj[action.field].concat(action.data);
        newData[action.id] = newObj;
        return Object.assign({}, state ,{data:newData});
    case 'REMOVE_CHILD_COMPLETE':
        let _newData = {...state.data}
        let _newObj = _newData[action.id]
        _newObj[action.field].splice(action.index,1);
        _newData[action.id] = _newObj;
        return Object.assign({}, state ,{data:_newData});        
    default:
      return state;
    }
}

const mappedData = (data) => data.reduce((accumulator, currentValue) => Object.assign(accumulator, {[currentValue.id]:  currentValue}), {});
