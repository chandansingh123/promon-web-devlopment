
import request from 'superagent';

import { fetch, onIndexedChange, clearData  } from './coreAction';
import config from 'config/config';
import { ToastType, notify } from 'utils/Utils';

const module = 'omkData';
const url = `${config.backend.url}/surveys/`;

export const clearOmkData = _ => clearData (module);

// Function related to fetching entire OMK data for a survey

export const fetchCompleteOmkData = id => fetch (module, `${url}${id}/data`);

// Functions related to fetching

export const fetchOmkData = id => fetch (module, `${url}${id}/unapproved/`);

export const onIndexedChangeOmkData = (field, index, value) => onIndexedChange (module, field, index, '', value);

export function acceptOmkData (id, data, accept) {
  return function (dispatch) {
    // Ignore rejects if it was created manually
    if (accept !== 'Accept' && data.status === 'CREATED') {
      dispatch (deleteOmkData (data.id));
      return;
    }

    data.status = accept === 'Accept' ? 'APPROVED' : 'REJECTED';
    const token = localStorage.getItem('token');
    return request.post (`${url}${id}/update_data/`)
      .set('Authorization',`Token ${token}`)
      .send(data)
      .end((error,response) => {
        if(!error && response) {
          dispatch (deleteOmkData (data.id));
        } else {
          console.log('There is an error while accepting/rejecting data');
        }
      });

  }
}

export const deleteOmkData = (id) => ({type: 'DELETE', module, id});

export function addRowOmkData (fields) {
  const uuid = uuidv4();
  const time = new Date();
  const row = { status: 'CREATED', id: uuid };
  fields.forEach (f => {
    if (f.meta && f.meta.preloaded) {
      switch (f.meta.preloaded) {
        case 'timestamp': row['_' + f.value] = time.toISOString().substring(0, 16); break;
        case 'date': row['_' + f.value] = time.toISOString().split('T')[0]; break;
        case 'property': row['_' + f.value] = '0'; break;
      }
    } else
      row['_' + f.value] = ''
  });
  row['_meta_instanceid'] = uuid;
  return {
    type: 'ADD_ROW',
    module,
    uuid,
    row
  }
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export const modifyOmkData = (surveyId, data, type) => dispatch => {
  const token = localStorage.getItem('token');
  return request.post (`${config.backend.url}/surveys/${surveyId}/data/${data.meta_instanceid}?action=${type}`)
    .set ('Authorization',`Token ${token}`)
    .send (data)
    .end ((error,response) => {
      if (!error && response) {
        if (type === 'delete') {
          dispatch (deleteSuccessOmkData (surveyId, data.meta_instanceid));
          notify(ToastType.SUCCESS, `Data (${data.meta_instanceid}) was deleted successfully.`);
        } else if (type === 'update') {
          dispatch (updateSuccessOmkData (surveyId, data.meta_instanceid, data));
          notify(ToastType.SUCCESS, `Data (${data.meta_instanceid}) was updated successfully.`);
        }
      } else {
        if (type === 'delete')
          notify(ToastType.ERROR, `Data (${data.meta_instanceid}) deletion failed.`);
        else if (type === 'update')
          notify(ToastType.ERROR, `Data (${data.meta_instanceid}) update failed.`);
      }
    });
}

const deleteSuccessOmkData = (surveyId, id) => ({type:'DELETE_SUCCESS', module, surveyId, id});

const updateSuccessOmkData = (surveyId, id, data) => ({type:'UPDATE_SUCCESS', module, surveyId, id, data});
