import React from 'react';
import { Link } from 'react-router-dom';

import { validateEmail } from 'utils/Utils';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      overallError: '',
      usernameError: '',
    };
    this.callBack = this.callBack.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  usernameChanged(event) {
    this.setState({ username: event.target.value, usernameError: '' });
  }

  passwordChanged(event) {
    this.setState({ password: event.target.value });
  }

  handleLogin (event) {
    event.preventDefault();
    const loginPayLoad = {};
    if (this.state.username === '') {
      this.setState({ usernameError: 'Email is required field.' })
    } else if (!validateEmail(this.state.username)) {
      this.setState({ usernameError: 'Please enter a valid email.' })
    } else {
      loginPayLoad.email = this.state.username;
      loginPayLoad.password = this.state.password;
      this.props.loginUser (loginPayLoad, this.callBack);
    }
  }

  callBack(type, message) {
    if(type==='error'){
      this.setState({overallError:message})
    }else{
      return this.props.history.push('/');
    }
  }

  render() {
    return (
      <form>
        {this.state.overallError && <div style={{ color: 'red' }}>{this.state.overallError}</div>}
        <div className="form-group">
          <input className="form-control" placeholder="Email" required="required" type="text" autoFocus value={this.state.username}
            onChange={this.usernameChanged.bind(this)} />
          {this.state.usernameError && <div style={{ color: 'red' }}>{this.state.usernameError}</div>}
        </div>
        <div className="form-group">
          <input className="form-control" placeholder="Password" required="required" type="password"
            onChange={this.passwordChanged.bind(this)} />
        </div>
        <div className="form-group">
          <button type="submit" className="btn uppercase" onClick={this.handleLogin}>Login</button>
        </div>
        <div className="clearfix login-footer">
          <label className="checkbox-inline"><input type="checkbox" /> Stay Logged in</label>
          <div className="pull-right">
            <Link to='/auth/forgot-password' >Forgot Password?</Link>
          </div>
        </div>
      </form>
    );
  }
}

export default Login;