
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { StyleSheet, css } from 'aphrodite';

import { setUi } from 'actions/uiAction';

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

const PictureViewer = ({ ui, uiKey, tooltip, setUi }) => {
  if (ui[uiKey]) {
    return (
      <div className={`${css(styles.container)}`} onClick={_ => setUi(uiKey, undefined)} >
        <div className={`${css(styles.innerContainer)}`}>
          <img className={`${css(styles.image)}`} src={ui[uiKey]} alt={tooltip} onClick={event => event.stopPropagation()} />
        </div>
      </div>
    );
  } else {
    return null;
  }
}


export default compose (
  connect(
    state => ({
      ui: state.ui
    }),
    dispatch => ({
      setUi: (key, value) => dispatch(setUi(key, value))
    })
  ),
) (PictureViewer);
