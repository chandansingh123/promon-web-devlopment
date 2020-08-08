
import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { setUi } from 'actions/uiAction';

export const MAP_SUMMARY_DISPLAY = 'map.summary.display';

const styles = {
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    float: 'left',
    verticalAlign: 'middle',
    margin: '2px 5px 2px 2px'
  },
  legendText: {
    display: 'inline-block',
    width: 100,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }, content: {
    margin: '3px 1px',
    fontSize: 11,
    lineHeight: 1
  },
  container: {
    border: 'black solid .5px',
    padding: 5,
    width: 360,
    backgroundColor: 'rgba(255,255,255,0.7)',
    height: 200,
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 10
  }
};

const getOverlayColorElement = function (key, overlayColors, overlayCounts, width) {
  const color = overlayColors[key] ? overlayColors[key] : 'black';
  const textStyle = {...styles.legendText, width: (width === 6 ? 88 : 232)};
  const text = key === 'null' ? 'N/A' : key;

  return (
    <div key={key} className={`mdl-cell mdl-cell--${width}-col`} style={styles.content}>
      <div style={{float: 'right', paddingLeft: 2}}>[{overlayCounts[key]}]</div>
      <span style={{...styles.legendColor, backgroundColor: color}} />
      <div style={textStyle} title={text}>{text}</div>
    </div>
  );
}

const getProjectSummaryContent = projectSummary => {
  const overlayColorSize = Object.keys(projectSummary.overlayColors).length;
  const width = overlayColorSize > 6 ? 6: 12;

  return (
    <div>
      <h2>{projectSummary.projectName}</h2>

      <div id="pm-map-summary-overlays" className="mdl-grid" >
        {Object.keys(projectSummary.overlayColors).map( key => getOverlayColorElement(key, projectSummary.overlayColors, projectSummary.overlayCounts, width) )}
        { projectSummary.overlayCounts && projectSummary.overlayCounts['N/A'] &&
          getOverlayColorElement ('N/A', projectSummary.overlayColors, projectSummary.overlayCounts, width)
        }
      </div>
      <div id="pm-map-summary-count" className="pm-map-summary-count">Total households: {projectSummary.totalHouseHold}</div>
    </div>
  )
}

const ProjectSummary = ({ displayProjectSummary, toggleProjectSummaryDisplay, projectSummary }) => {
  const containerStyle = {...styles.container, visibility: displayProjectSummary ? 'visible' : 'hidden'};

  return (
    <div id="pm-map-summary-wrp">

      <div id="pm-map-summary" style={containerStyle} >
        <button id="pm-project-summary-minimize" className="mdl-button mdl-js-button mdl-button--icon pm-project-summary-minimize"
          onClick={toggleProjectSummaryDisplay}>
          <i className="material-icons">&#xE313;</i>
        </button>
        {projectSummary.projectName && getProjectSummaryContent(projectSummary)}
      </div>

      <div id="pm-map-summary-hidden-icon-wrp" style={{visibility: displayProjectSummary ? 'hidden' : 'visible', zIndex: 10 }}>
        <button className="mdl-button mdl-js-button mdl-button--icon"  onClick={toggleProjectSummaryDisplay}>
          <i className="material-icons" id="pm-map-summary-hidden-icon" > &#xE5C3;</i>
        </button>
      </div>

    </div>
  );
};


export default compose (

  connect(
    state => ({
      projectSummary: state.map.projectSummary,
      displayProjectSummary: state.ui[MAP_SUMMARY_DISPLAY] 
    }),
    dispatch => ({
      setUi: (field, value) => dispatch(setUi(field, value)),
    })
  ),

  withHandlers({
    toggleProjectSummaryDisplay: props => _ => props.setUi(MAP_SUMMARY_DISPLAY, !props.displayProjectSummary)
  })
)(ProjectSummary);
