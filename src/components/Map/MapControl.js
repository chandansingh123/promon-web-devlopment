import React from 'react';

const styles = {
  container: {
    left: 440,
    top: 12,
    position: 'absolute',
    display: 'flex',
    padding: 2,
    // backgroundColor: '#41443f',
    // borderRadius: 4
  },
  button: {
    backgroundColor: 'white',
    width: 35,
    height: 41,
    display: 'block',
    border: 'none',
    color: 'white',
  },
  icon: {
    fontSize: 25,
    color: 'black'
  }
};

const MapControl = (props) => (
  <div id="pm-map-control-container" style={styles.container} >
    <button id="zoom-in-map" style={styles.button} title="Zoom In">
      <i className="material-icons" style={styles.icon} >add</i>
    </button >
    <button id="zoom-out-map" style={styles.button} title="Zoom Out">
      <i className="material-icons" style={styles.icon} >remove</i>
    </button>
    <button id="project-extent-zoom" style={styles.button} title="Zoom to Project Area">
      <i className="material-icons" style={styles.icon} >near_me</i>
    </button>
  </div>
);

export default MapControl;