import React from 'react';

import request from 'superagent';
import queryString from 'query-string';

import config from 'config/config';


class ResetPassword extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      newPassword: '',
      confirmPassword: '',
      error: '',
      success: false
    };
  }

  passwordChanged (event) {
    this.setState ({newPassword: event.target.value});
  }

  confirmPasswordChanged (event) {
    this.setState ({confirmPassword: event.target.value});
  }

  formSubmit (event) {
    event.preventDefault ();
    if (this.state.newPassword !== this.state.confirmPassword)
      this.setState({error: 'Passwords do not match.'});

    const queryStringObj = queryString.parse(this.props.location.search);
    const payload = {
      password: this.state.newPassword,
      token: queryStringObj.token
    };
    request.put(`${config.backend.url}/user/activate/`)
      .set('Content-Type', 'application/json')
      .send(payload)
      .end(function(error,response){
          if(!error && response) {
            this.setState ({success: true});
            setTimeout (() =>  this.props.history.push ('/auth/login'), 5000);
          } else {
            this.setState({error: JSON.parse(response.text).non_field_errors[0]});
          }
      }.bind(this))
}

  render () {
    return (
      <form onSubmit={this.formSubmit.bind(this)}>
        <div className="form-group">
          <input className="form-control" placeholder="New Password" required="required" type="password" onChange={this.passwordChanged.bind(this)}  />
        </div>
        <div className="form-group">
          <input className="form-control" placeholder="Confirm password" required="required" type="password" onChange={this.confirmPasswordChanged.bind(this)}  />
        </div>
        <div style={{minHeight: 20}}>
          {this.state.error !== undefined && this.state.error}
          { this.state.success &&
            <div>
              Your password was changed. You will be redirected to the login page.<br />
              Please login with your username and your updated password.
            </div>
          }
        </div>
        <div className="form-group">
          <button type="submit" className="btn uppercase">Reset Password</button>
        </div>
      </form>
    );
  }
}

export default ResetPassword;