
import React from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from 'actions/uiAction';
import ToolTip from 'components/Common/ToolTip';
import logo from 'images/logo.png';


export const HabitatLogo = _ => (
  <Link id='rem-navbar-home' className="mdl-navigation__link" to='/' >
    <img  src={logo} style={{maxHeight: 60, maxWidth: 110}} alt='Habitat for Humanity' />
  </Link>
);

const AvatarLogoComponent = ({session, ui, toggleAccountToolTip, ...props}) => (
  <div style={{position: 'relative'}}>
    <button id='rem-navbar-avatar' className="mdl-button mdl-js-button mdl-button--icon" onClick={() => toggleAccountToolTip()}>
      { session.user && session.user.avatar ?
        <div style={{marginLeft: -3}}>
          <img src={session.user.avatar} alt='Avatar' style={{maxWidth: 38, maxHeight: 38}} />
        </div> :
        <i className="material-icons">account_circle</i>
      }
    </button>

    { ui.displayAccountToolTip && <ToolTip /> }
  </div>
);

export const AvatarLogo = compose (
  connect (
    state => ({...state}),
    dispatch => bindActionCreators (actionCreators, dispatch)
  )
)(AvatarLogoComponent);
