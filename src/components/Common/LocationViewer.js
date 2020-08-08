
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { StyleSheet, css } from 'aphrodite';

import { setUi } from 'actions/uiAction';
import OLWrapper from 'components/ext/openlayers';

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
    justifyContent: 'center',
    width: '80vw',
    height: '80vh',
    border: '1px solid rgba(0, 0, 0, 0.2)'
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

const PictureViewer = ({ ui, uiKey, setUi }) => {
  if (ui[uiKey]) {
    const point = ui[uiKey].split(' ');
    return (
      <div className={`${css(styles.container)}`} onClick={_ => setUi(uiKey, undefined)} >
        <div className={`${css(styles.innerContainer)}`}>
          <OLWrapper id='rem-location-map' style={{width: '100%', height: '100%'}}
            extent = {[point[1] - 0.005, +point[0] - 0.005, +point[1] + 0.005, +point[0] + 0.005]}
            point = {[+point[1], +point[0]]}
          />

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
