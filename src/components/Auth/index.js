
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import { Switch} from 'react-router';

import * as actionCreators from 'actions/authAction';
import 'css/auth.css';
import BackgroundSlideShow from 'react-background-slideshow';

import logo from 'images/logo.png';

import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import image1 from 'images/1.jpg';
import image2 from 'images/2.jpg';
import image3 from 'images/3.jpg';

const AuthRoot = (props) => (
  <main>
    <BackgroundSlideShow images={[ image1, image2, image3 ]}/>

    <div className="login-body">
      <div className="overlay">
        <div className="login-box">
          <div className="mytable">
            <div className="table-cell va-middle">
              <div className="login-form">
                <div className="logo text-center"><img src={logo} alt='Habitat for Humanity' /></div>
                <Switch>
                  <Route exact path='/auth/login'><Login {...props}/></Route>
                  <Route exact path='/auth/forgot-password'><ForgotPassword {...props}/></Route>
                  <Route exact path='/auth/reset-password'><ResetPassword {...props} /></Route>
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators (actionCreators, dispatch);
}

export default withRouter (connect (mapStateToProps, mapDispatchToProps)(AuthRoot));
