import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from 'actions/userActions';
import Filter from './Filter';
import BaseLayer from './BaseLayer';
import OverLaySection from './DrawerOverlaySection';
import MapDownload from './MapDownload';


const styles = StyleSheet.create ({
  drawer: {
    display: 'flex', flexDirection: 'column', flexWrap: 'nowrap',
    width: 320, height: '100%', maxHeight: '100%',
    position: 'absolute', top: 0, left: 0,
    boxShadow: '0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)',
    boxSizing: 'border-box',
    borderRight: '1px solid #e0e0e0',
    background: '#fafafa',
    transform: 'translateX(-320px)',
    transformStyle: 'preserve-3d',
    willChange: 'transform',
    transitionDuration: '.2s',
    transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)',
    transitionProperty: 'transform',
    color: '#424242',
    overflow: 'visible',
    overflowY: 'auto',
    zIndex: 5
  },
  drawerVisible: {
    left: 0,
    transform: 'translateX(0)'
  },
  obfuscator: {
    backgroundColor: 'rgba(0,0,0,.5)',
    opacity: 0,
    transitionProperty: 'opacity',
    pointerEvents: 'none',
    position: 'absolute', top: 0, left: 0,
    height: '100%', width: '100%',
    zIndex: 4,
    visibility: 'hidden',
    transitionProperty: 'background-color',
    transitionDuration: '.2s',
    transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)'
  },
  obfuscatorVisible: {
    pointerEvents: 'auto',
    opacity: 1,
    visibility: 'visible'
  }
});

const Drawer = ({setUi, ...props}) => {
  const containerClass = props.ui['map.drawerShow'] ? `${css(styles.drawer)} ${css(styles.drawerVisible)}` :  `${css(styles.drawer)}`;
  const obfuscatorClass = props.ui['map.drawerShow'] ? `${css(styles.obfuscator)} ${css(styles.obfuscatorVisible)}` :  `${css(styles.obfuscator)}`;

  return (
    <div>
      <div className={containerClass}>
        <BaseLayer baseLayers={props.map.baseLayers} setUi={setUi} ui={props.ui}
            setSession={props.setSession} session={props.session} />

        <OverLaySection />
        <Filter />
        <MapDownload  map={props.map.map} osmLayer={props.map.osmLayer}  setUi={setUi} ui={props.ui}/>
      </div>
      <div className={obfuscatorClass} onClick={evt => { evt.stopPropagation(); setUi('map.drawerShow', false);} }/>
    </div>
  );
};

export default compose (

  connect(
    state => ({...state}),
    dispatch => bindActionCreators(actionCreators, dispatch)
  ),

  withHandlers({

  })
)(Drawer);
