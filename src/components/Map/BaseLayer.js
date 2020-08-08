
import React from 'react';
import { compose, withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from 'actions/userActions';
import Accordian from './Accordian';
import Select from 'components/Admin/Common/Select';
import Switch from 'components/Admin/Common/Switch';
import icon from 'images/base-layer.png';


const BaseLayer = ({ options, session, setUi, ui, projectLayers, projectLayersSession,
    switchBaseLayer, switchProjectLayers
  }) => (
  <Accordian header='Base Layer' icon={icon} section='base-layer' setUi={setUi} ui={ui}
    body={
      <div>
        <Select options={options} value={session['map.baselayer']} onChange={switchBaseLayer} />
        { projectLayers && <div>
          {projectLayers.map(pl =>
            <Switch key={pl.code} id={`rem-map-project-layer-${pl.code}`} checked={projectLayersSession[pl.code]} label={pl.name}
              field={pl.code} onChange={switchProjectLayers} />
          )}
          </div>
        }
      </div>
    }
  />
);


export default compose(
  connect(
    state => ({...state}),
    dispatch => bindActionCreators(actionCreators, dispatch)
  ),

  withProps( props => {
    return {
      projectCode: props.session.projectCode,
      options: props.baseLayers.reduce((acc, bl) => Object.assign(acc, {[bl]:  bl}), {} ),
      projectLayers: props.session.projects && props.session.projectCode &&
        props.session.projects.find(p => p.code === props.session.projectCode).base_layers,
      projectLayersSession: props.session['map.project.baseLayers'] || {}
    }
  }),

  withHandlers({
    switchBaseLayer: props => (_, layer) => props.setSession('map.baselayer', layer),
    switchProjectLayers: props => layerCode => {
      const layers = props.session['map.project.baseLayers'] || {};
      layers[layerCode] = !layers[layerCode];
      const newLayers = Object.assign({}, layers);
      props.setSession('map.project.baseLayers', newLayers);
    }
  })

)(BaseLayer);
