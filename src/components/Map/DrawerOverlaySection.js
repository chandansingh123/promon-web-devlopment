
import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { addOverlayStart } from 'actions/overlayAction';
import { toggleOverlayInMap } from 'actions/mapAction';
import { setUi } from 'actions/uiAction';
import { fetchUserSurveyGeojson } from 'actions/projectUserAction';
import Accordian from './Accordian';
import icon from 'images/overlays.png';
import OverlayFilterForm from './OverlayFilterForm';
import MiniFab from 'components/Common/MiniFab';

export const OVERLAYS_ACTIVE = 'map.overlays';
export const MAP_SUMMARY_DISPLAY = 'map.summary.display';

const CheckBox = ({id, label, onClick, value}) => (
  <div key={id}>
    <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={`map-layer-${id}`}>
      <input type="checkbox" id={`map-layer-${id}`} className="mdl-checkbox__input"
        onChange={() => onClick (id)} checked={value} />
        <div className="mdl-checkbox__label"  title={label}
          style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 250, display: 'inline-block', fontSize: 12}} >
          {label}
        </div>
    </label>
  </div>
);


const DrawerOverlaySection = ({
    overlays, currentOverlays, ui,
    toggleOverlayInMap, addOverlayStart, setUi
  }) => (
  <Accordian header='Overlays' icon={icon} section='overlay' setUi={setUi} ui={ui}
    body={
      <div style={{position: 'relative', paddingBottom: 36}}>
        { Object.values(overlays).map(obj =>
          <CheckBox id={obj.id} key={obj.id} label={obj.alias} onClick={toggleOverlayInMap} value={currentOverlays.includes(obj.id)} />
        )}

        <div style={{position: 'absolute', right: 0, bottom: 0}}>
          <MiniFab icon='add' onClick={addOverlayStart}/>
        </div>

        <OverlayFilterForm id='rem-overlay-form' type='Overlay' storeSection='overlays' />
      </div>
    }
  />
);

export default compose (

  connect(
    state => ({
      overlays: state.overlays.data,
      currentOverlays: state.ui[OVERLAYS_ACTIVE] || [],
      ui: state.ui,
      gis: state.gis,
      session: state.session
    }),
    dispatch => ({
      toggleOverlayInMap: (overlayId, currentOverlays, overlays) => dispatch(toggleOverlayInMap(overlayId, currentOverlays, overlays)),
      addOverlayStart: _ => dispatch(addOverlayStart()),
      setUi: (field, value) => dispatch(setUi(field, value)),
      fetchUserSurveyGeojson: (projectCode, surveyId) => dispatch(fetchUserSurveyGeojson(projectCode, surveyId))
    })
  ),

  withHandlers({
    toggleOverlayInMap: props => overlayId => {

      // Download survey
      const surveyId = props.overlays[+overlayId].survey;
      if (props.gis.data[surveyId] === undefined)
        props.fetchUserSurveyGeojson (props.session['projectCode'], surveyId);

      // Enable overlay
      const activeOverlays = props.currentOverlays.includes(overlayId)
        ? props.currentOverlays.filter(id => id !== overlayId)
        : [overlayId, ...props.currentOverlays];
      props.setUi(OVERLAYS_ACTIVE, activeOverlays);
      props.setUi(MAP_SUMMARY_DISPLAY, !!activeOverlays);
    }
  })
)(DrawerOverlaySection);
