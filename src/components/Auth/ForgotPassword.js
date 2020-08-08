import React from 'react';
import {validateEmail, displaySnakBar} from '../../utils/Utils';

class ForgotPassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      error:''
    };

    this.resetSuccessCallBack = this.resetSuccessCallBack.bind(this);
  }

  handleUserNameChange(event) {
    const username = event.target.value;
    this.setState({
      username: username
    });
  }

  handleResetButtonClick(event) {
    event.preventDefault();
    if(validateEmail(this.state.username)){
      this.props.resetPassword(this.state.username, this.resetSuccessCallBack);
    }else{
      this.setState({error:'Please enter a valid email.'})
    }
  }

  resetSuccessCallBack () {
    displaySnakBar("Reset detail has been sent to email \" "+this.state.username+"\"");
  }


  render() {
    return (
      <div style={{ color: 'white' }}>
        <h2>Forgot Password?</h2>
        <div style={{ paddingBottom: '10px' }}>Enter the email address associated with your account, and we’ll email you the information to reset your password.</div>
        <form>
          <div className="form-group">
            <input className="form-control" placeholder="Your email" required="required"
                type="text" value={this.state.username} onChange={this.handleUserNameChange.bind(this)} />
            {this.state.error && <div style={{color:'red'}}>{this.state.error}</div>}   
          </div>
          <div className="form-group">
            <button type="submit" className="btn uppercase" onClick={this.handleResetButtonClick.bind(this)}>SEND RESET INFO</button>
          </div>
        </form>
      </div>
    );
  }
}

export default ForgotPassword;
