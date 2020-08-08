
import request from 'superagent';

import config from 'config/config';

const updateUserToken = token => ({ type:'UPDATE_USER_TOKEN', token});

export function loginUser (loginPayLoad, callBack) {
  return function(dispatch){
    return request.post(`${config.backend.url}/login/`)
      .set('Content-Type', 'application/json')
      .send (loginPayLoad)
      .end (function (error, response) {
        if(!error && response){
          dispatch (updateUserToken (response.headers.token));
        if (response.headers.token) {
          localStorage.setItem('token',response.headers.token)
        }
        callBack ();
        } else {
        callBack ('error', "Username and password combination didn't match");
      }
    });
  }
}
  

export function logoutUser (logoutSuccessCallBack) {
  const token = localStorage.getItem('token');

  localStorage.removeItem('token');
  localStorage.removeItem('userDetail');

  return function () {
    return request.get(`${config.backend.url}/logout/`)
      .set('Authorization',`Token ${token}`)
      .end((error,response) => {
        if (!error && response) {
          if (logoutSuccessCallBack)
            logoutSuccessCallBack ();
        } else {
          console.info (error);
        }
    })
  }
}

// If success please remove the token form local storage.
export function resetPassword (email, successCallBack) {
  return function (dispatch) {
  return request.post (`${config.backend.url}/users/forget-password/`)
      .set ('Content-Type', 'application/json')
      .send (JSON.stringify ({email}))
      .end ((error,response) => {
      if (!error && response) {
        localStorage.removeItem('token');
        localStorage.removeItem('userDetail');
        successCallBack();
      } else {
        console.info(error);
      }
      });
  }
}
