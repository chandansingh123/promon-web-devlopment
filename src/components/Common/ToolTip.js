import React from 'react';
import { Link } from 'react-router-dom';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ColoredButton from 'components/Admin/Common/ColoredButton';
import * as uiActionCreators from 'actions/uiAction';
import * as authActionCreators from 'actions/authAction';

const styles = {
  innerTriangle: {
    backgroundColor: 'transparent',
    width: 0,
    border: '10px solid transparent',
    borderBottom: '10px solid #afacac',
    position: 'absolute',
    right: 10
  },
  outerTriangle: {
    backgroundColor: 'transparent',
    width: 0,
    border: '10px solid transparent',
    borderBottom: '10px solid white',
    position: 'absolute',
    top: 1,
    right: 10,
    zIndex: 1000
  },
  contentContainer: {
    background: 'white',
    position: 'absolute',
    right: 0,
    top: 20,
    border: '1px solid #ccc',
    color: 'black'
  },
  container: {
    position: 'absolute',    
    zIndex: 1000,
    bottom: 10,
    right: 0
  },
  nameContainer: {
    margin: 20,
    whiteSpace: 'nowrap',
    width: 'max-content'
  },
  icon: {
    textAlign: 'center',
    lineHeight: '40px',
    fontSize: '20px',
    float:'left',
    marginRight: 20,
    position: 'relative',
    marginBottom: 10
  },
  buttonContainer: {
    background: '#f5f5f5',
    borderTop: '1px solid #ccc',
    borderColor: 'rgba(0,0,0,.2)',
    width: '100%',
    display: 'table',
    padding: 10
  }
};


const ToolTip = ({session, toggleAccountToolTip, logout}) => (
  <div>
    <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'transparent', zIndex: 100}}
      onClick={toggleAccountToolTip}
    />
    <div style={styles.container} >
        <div style={styles.innerTriangle} />
        <div style={styles.outerTriangle} />

        <div style={styles.contentContainer} >
        <div style={{minWidth:'250px', position:'relative'}}>
            <div style={styles.nameContainer} >
            <div className="mdl-list__item-avatar" style={styles.icon}>
              {
                session.user.avatar ?
                <img src={session.user.avatar} style={{maxHeight: 50, maxWidth: 50}} alt={`${session.user.first_name} ${session.user.last_name}`} /> :
                <div>
                  {session.user.first_name.toUpperCase().charAt(0)}{session.user.last_name.toUpperCase().charAt(0)}
                </div>
              }
            </div>
            <div style={{display: 'inline-block', verticalAlign: 'top', float:'left'}}>
                <div style={{fontWeight:'bold'}}>
                {session.user.first_name}&nbsp;{session.user.last_name}
                </div>
                {session.user.email}
                <div>
                  <Link to='/profile'>Profile</Link>
                </div>
            </div>
            </div>
            <div style={styles.buttonContainer} >
            <ColoredButton label="Sign out" onClick={logout} />
            </div>
        </div>
        </div>
    </div>
  </div>
);

export default compose(
  connect (
    state => ({...state}),
    dispatch => bindActionCreators ({...uiActionCreators, ...authActionCreators}, dispatch)
  ),

  withHandlers ({
    logout: (props) => () => {
      props.logoutUser();
      window.location.reload();
    }
  })
) (ToolTip);
