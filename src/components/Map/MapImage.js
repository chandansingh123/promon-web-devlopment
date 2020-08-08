
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { StyleSheet, css } from 'aphrodite';

import * as actionCreators from 'actions/userActions';

const styles = StyleSheet.create ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
    display: 'flex',
    justifyContent: 'center'
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  image: {
    maxHeight: '100%',
    maxWidth: 'calc(83.33% - 16px)',
    '@media (max-width: 992px)': {
      maxWidth: 'calc(100% - 16px)',
      marginLeft: 8,
    }
  }
});

const MapImage = (props) => (
  <div className={`${css(styles.container)}`} onClick={() => props.setSession ('map.image', undefined)} >
    <div className={`${css(styles.innerContainer)}`}>
      <img className={`${css(styles.image)}`} src={props.session['map.image']} alt='Household Survey' onClick={event => event.stopPropagation()} />
    </div>
  </div>
);


export default compose (
  connect(
    state => ({...state}),
    dispatch => bindActionCreators(actionCreators, dispatch)
  ),
) (MapImage);
