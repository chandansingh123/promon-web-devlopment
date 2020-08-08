
import config from 'config/config';
import { addStart, addFinish, addCancel, updateFinish,
  fetch, emptyData,
  formFieldChange, editStart,
  onChange, onIndexedChange, addRow, removeRow,
  _delete } from './coreAction';

const module = 'popup';
const url=`${config.backend.url}/projects/`;

const emptyPopupState = {
  type: '',
  survey: '',
  surveyfield: '',
  label: '',
  editing: true
};

// Actions related to FETCH

export const fetchPopups = (projectCode) => fetch (module, `${url}${projectCode}/popups/`);

// Actions related to ADD

export const addStartPopup = (projectCode) => addStart (module, emptyPopupState);

export const addFinishPopup = (projectCode, data) => addFinish (module, data, `${url}${projectCode}/popups/`, {...emptyPopupState, editing: false});

export const addEditCancelPopup = () => addCancel (module,  {...emptyPopupState, editing: false});


// Actions related to EDITS

export const editStartPopup = (id) => editStart(module, id);

export const editFinishPopup = (projectCode, data) => updateFinish (module, data, `${url}${projectCode}/popups/${data.id}/`);

export function formFieldChangePopup (field, value, surveyId, surveys) {
  return function (dispatch) {
    dispatch (formFieldChange (module, field, value));
    if (field === 'surveyfield') {
      const fieldValue = surveys[surveyId].fields.filter( surveyField => surveyField.psf_id === +value)[0];
      dispatch (formFieldChange(module, 'label', fieldValue.label));
    }
  }
}


export function onIndexedChangePopup (field, index, childField, value, aux) {
  return function (dispatch) {
    switch (childField) {
      case 'surveyField':
        dispatch (onIndexedChange(module, field, index, childField, value));
        const selectedField = aux.filter (f => f.id === +value)[0];
        if (field === 'columns')
          dispatch (onIndexedChange(module, field, index, 'label', selectedField.label));
        else
          dispatch (onIndexedChange(module, field, index, 'caption', selectedField.label));
        break;
      default:
        dispatch (onIndexedChange(module, field, index, childField, value));
        break;
    }
  }
}

export function onChangePopup (field, value, aux) {
  return function (dispatch) {
    switch (field) {
      case 'headerSurveyField':
        dispatch (onChange(module, field, value));
        const selectedField = aux.filter (f => f.id === +value)[0];
        dispatch (onChange(module, 'headerLabel', selectedField.label));
        break;
      default:
        dispatch (onChange(module, field, value));
        break;
    }
  }
}

export function addRowPopup (field) {
  switch (field) {
    case 'columns':
      return addRow (module, field, {survey: '', surveyField: '', label: ''});
    case 'images':
      return addRow (module, field, {survey: '', surveyField: '', caption: ''});
    default:
      break;
  }
}

export const removeRowPopup = (field, idx) => removeRow (module, field, idx);

// Actions related to delete

export const deletePopup = (projectCode, id) => _delete(module, id, `${url}${projectCode}/popups/${id}/`);

export const emptyDataPopup = () => emptyData (module);
