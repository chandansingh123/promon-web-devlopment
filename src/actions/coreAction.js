import request from 'superagent';


// Common functions

function handleAuthFailure (response ) {
  if (+response.status === 401) {
    localStorage.removeItem ('token');
    window.location = '/auth/login';
  }
}


// simple functions

export function simplePost (url, payload, callback) {
  const token = localStorage.getItem('token');
  return function (dispatch) {
    return request.post (url)
      .set('Authorization',`Token ${token}`)
      .send(payload)
      .end((error,response) => {
        if(!error && response) {
          if (callback)
            dispatch (callback ());
        } else {
          console.log('There was an error while POSTing data.');
        }
      });
  }
}

// Functions related to fetching of data

export const clearData = module => ({ type: 'CLEAR_DATA', module});

export function fetch(module, url, callback){
    const token = localStorage.getItem('token');
    return function(dispatch){
      dispatch(fetchStarted(module));
      return request.get(url)
          .set('Authorization',`Token ${token}`)
          .end((error,response) => {
              if(!error && response){
                  if (callback) {
                    dispatch (fetchCompleted (module));
                    callback (module, response.body, dispatch);
                  } else
                    dispatch (dataReceived (module, response.body));
              }else{
                  dispatch(fetchError(module, 'There is an error while fetching data...'))
                  console.log('There is an error while fetching data');
                  handleAuthFailure (response);
              }
          })
    }
}

export function fetchPartial (module, url, field) {
  const token = localStorage.getItem ('token');
  return function (dispatch){
    dispatch (fetchStarted (module));
    return request.get (url)
        .set ('Authorization', `Token ${token}`)
        .end ((error,response) => {
            if (!error && response) {
                dispatch (partialDataReceived (module, response.body, field));
            } else {
                dispatch (fetchError (module, 'There is an error while fetching data...'))
                console.log ('There is an error while fetching data');
                handleAuthFailure (response);
            }
        })
  }
}

const fetchStarted = (module) => ({type:'FETCH_STARTED', module});

const fetchCompleted = (module) => ({type:'FETCH_COMPLETED', module});

const dataReceived = (module, data) => ({type: 'DATA_RECEIVED', module, data});

const partialDataReceived = (module, data, field) => ({type: 'PARTIAL_DATA_RECEIVED', module, data, field});

const fetchError = (module, message) => ({type:'FETCH_ERROR', module, message})


// Functions related to adding of data

export const addTemp = (module, obj) => ({type: 'ADD_COMPLETED', module, data: obj});

export const addStart = (module, obj) => ({type: 'ADD_STARTED', module, obj});

export const addCancel = (module, obj) => ({type: 'ADD_CANCELLED', module, obj});

export function addStepFinish (module, data, url) {
    const token = localStorage.getItem('token');
    return function(dispatch){
      return request.post (url)
        .set('Authorization',`Token ${token}`)
        .send(data)
        .end((error,response) => {
          if(!error && response) {
            dispatch (addStepCompleted (module, response.body));
          } else {
            console.log('There is an error while saving data');
            handleAuthFailure (response);
          }
        });
    }
}

const addStepCompleted = (module, data) => ({type: 'ADD_STEP_COMPLETED', module, data});

export function addFinish (module, data, url, emptyObj) {
  const token = localStorage.getItem('token');
  return function(dispatch){
    return request.post (url)
      .set('Authorization',`Token ${token}`)
      .send(data)
      .end((error,response) => {
        if(!error && response) {
          dispatch (addCompleted (module, response.body, emptyObj));
        } else {
          if (+response.status === 400) {
            dispatch (addUpdateError (module, response.body || response.text));
          } else
            handleAuthFailure (response);
        }
      });
  }
}

function addUpdateError (module, data) {
  const keys = Object.keys (data);
  keys.forEach (key => {
    if (data[key].constructor === Array)
      data[key] = data[key].join ('\n');
  });
  return {
    type: 'ADD_UPDATE_ERROR', module, data
  };
}

const addCompleted = (module, data, emptyObj) => ({type: 'ADD_COMPLETED', module, data, emptyObj});


// Functions related to editing of data

export const formFieldChange = (module, field, value) => ({type:'FORM_FIELD_CHANGE', module, field, value});

export const indexedFieldChange = (module, field, index, value) => ({type: 'INDEXED_FIELD_CHANGED', module, field, index, value});

export const valueChange = (module, index, value) => ({type: 'VALUE_CHANGED', module, index, value});

export const onChange = (module, field, value) => ({type:'ON_CHANGE', module, field, value});

export const onIndexedChange = (module, field, index, childField, value) => ({type: 'ON_INDEXED_CHANGE', module, field, index, childField, value});

export const addRow = (module, field, value) => ({type:'ADD_ROW', module, field, value});

export const removeRow = (module, field, index) => ({type:'REMOVE_ROW', module, field, index});

export const formSwitchToggle = (module,field) => ({type:'FORM_SWITCH_TOGGLE', module, field});

export const indexedSwitchToggle = (module, field, index) => ({type:'INDEXED_SWITCH_TOGGLE', module, field, index});

export const editStart = (module, id) => ({type: 'EDIT_STARTED', module, id});

export function updateFinish(module, data, url, emptyObj) {
    const token = localStorage.getItem('token');
    return function(dispatch){
      return request.put (url)
        .set('Authorization',`Token ${token}`)
        .send(data)
        .end((error,response) => {
          if(!error && response) {
            dispatch (updateSuccess(module, response.body, emptyObj));
          } else {
            if (+response.status === 400)
            dispatch (addUpdateError (module, response.body));
          else
            handleAuthFailure (response);
          }
        });
    }
}

const updateSuccess = (module, data, emptyObj) => ({type:'UPDATE_SUCCESS', module, data, emptyObj});

export function _delete(module, id, url, callback){
    const token = localStorage.getItem('token');
    return function(dispatch){
      return request.delete (url)
        .set('Authorization',`Token ${token}`)
        .end((error,response) => {
          if(!error && response) {
            if (module)
              dispatch (deleteSuccess (module, id));
            if (callback)
              callback();
          } else {
            console.log('There is an error while deleting data');
            handleAuthFailure (response);
          }
        });
    }
}

const deleteSuccess = (module, id) => ({type:'DELETE_SUCCESS', module, id});

export function addChildToParent(module, url, data, field, id){
  const token = localStorage.getItem('token');
  return function(dispatch){
    return request.post (url)
          .set('Authorization',`Token ${token}`)
          .send(data)
          .end((error,response) => {
            if(!error && response) {
              dispatch (addChildComplete (module, Object.values(data), id, field));
            } else {
              console.log('There is an error while saving data');
              handleAuthFailure (response);
            }
          });
  }
}

const addChildComplete = (module, data, id, field) =>({type:'ADD_CHILD_COMPLETE', module, data, id, field})

export function removeChildFromParent(module, url, field, id, index){
  const token = localStorage.getItem('token');
  return function(dispatch){
    return request.delete(url)
      .set('Authorization',`Token ${token}`)
      .end((error,response) => {
        if(!error && response) {
          dispatch (removeChildComplete (module, id, field, index));
        } else {
          console.log('There is an error while deleting data');
          handleAuthFailure (response);
        }
      });
  }
}

const removeChildComplete = (module, id, field, index) => ({type:'REMOVE_CHILD_COMPLETE', module, id, field, index});


export function  download(url){
  const token = localStorage.getItem('token');
  return function(dispatch){
    return request.get(url)
      .set('Authorization',`Token ${token}`)
      .end((error,response) => {
        if (+response.status === 307){
          window.location = response.body;
        }
      });
  }
}

export const onProgress = (module) => ({type: 'ON_PROGRESS', module});

// TODO fix this

export const emptyData = (module) => ({type: 'EMPTY_DATA', module});
