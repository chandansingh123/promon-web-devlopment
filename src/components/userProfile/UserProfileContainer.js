
import React from 'react';
import { compose, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, css } from 'aphrodite';

import * as uiActionCreators from 'actions/uiAction';
import * as userProfileActionCreators from 'actions/userProfileAction';
import UserPassword from './UserPasswordForm';
import UserProfile from './UserProfileForm';
import { HabitatLogo, AvatarLogo } from 'components/Common/NavbarComponents';


const styles = StyleSheet.create ({
  header: {
    'minHeight': 44,
    backgroundColor: 'rgb(0,175,215)',
    '@media (min-width: 360px)': {
      display: 'block'
    }
  }
});


const PASSWORD_REGEX = /(?=.*\d)(?=.*[A-Z])(?=.{8,})/;


const UserProfileContainer = (props) => (
  <div className='mdl-layout' style={{minHeight: '100vh'}}>

    <header className={`mdl-layout__header ${css(styles.header)}`}>
      <div className="mdl-layout__header-row" style={{height: 44}}>
        <HabitatLogo />
        <div style={{flexGrow: 1}} />
        <AvatarLogo />
      </div>
    </header>

    <div className='mdl-grid'>
      <div className='mdl-tabs mdl-js-tabs mdl-js-ripple-effect' style={{paddingTop: 20}}>
        <div className='mdl-tabs__tab-bar'>
          <a href='#profile' className='mdl-tabs__tab is-active'>Profile</a>
          <a href='#password' className='mdl-tabs__tab'>Change Password</a>
        </div>

        <div className='mdl-tabs__panel is-active' id='profile'>
          <UserProfile {...props} />
        </div>

        <div className='mdl-tabs__panel' id='password'>
          <UserPassword {...props} />
        </div>
      </div>
    </div>
  </div>
);


export default compose (
  connect (
    state => ({...state}),
    dispatch => bindActionCreators ({...uiActionCreators, ...userProfileActionCreators}, dispatch)
  ),

  withHandlers ({
    editMode: ({setUi}) => evt => {
      evt.preventDefault();
      setUi('profile.mode', 'edit');
    },
    viewMode: ({setUi, updateFinishUserProfile, userProfile}) => evt => {
      evt.preventDefault();
      updateFinishUserProfile (userProfile.newData);
      setUi('profile.mode', 'view');
    },
    updatePassword: ({userProfile, updateFinishUserProfilePassword}) => evt => {
      evt.preventDefault();
      const profile = userProfile.newData;
      if (profile.original_password && PASSWORD_REGEX.test(profile.new_password) && profile.confirm_password === profile.new_password)
        updateFinishUserProfilePassword (userProfile.newData);
    }
  }),

  lifecycle ({
    componentDidMount() {
      const userProfile = this.props.session ? this.props.session.user : {};
      this.props.loadUserProfile(userProfile);
    },
  })

) (UserProfileContainer);
