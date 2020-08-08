import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import icon from 'images/ruler.svg';
import { setUi } from 'actions/uiAction';
import FlatButton from 'components/Common/FlatButton';

export const MEASURE_TOOL_KEY = 'map.measure.tool';

const measureTooltips = [];
let draw;

export const addMeasureToolLayer = (ol, map) => {
  const measureToolLayer = new ol.layer.Vector({
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    })
  });
  measureToolLayer.set('name', 'Measure Tool');
  map.addLayer(measureToolLayer);

  return { measureToolLayer };
};


function enableMeasureTool(ol, map, { layer }) {
  const source = new ol.source.Vector();
  layer.setSource(source);

  let sketch;
  let measureTooltipElement;
  let measureTooltip;

  const formatLength = line => {
    const length = ol.Sphere.getLength(line);
    let output;
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) + ' km';
    } else {
      output = (Math.round(length * 100) / 100) + ' m';
    }
    return output;
  };

  function addInteraction() {
    draw = new ol.interaction.Draw({
      source: source,
      type: 'LineString',
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.7)'
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          })
        })
      })
    });
    map.addInteraction(draw);

    createMeasureTooltip();

    var listener;
    draw.on('drawstart',
        function(evt) {
          // set sketch
          sketch = evt.feature;

          var tooltipCoord = evt.coordinate;

          listener = sketch.getGeometry().on('change', function(evt) {
            const geom = evt.target;
            const output = formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
          });
        }, this);

    draw.on('drawend',
        function() {
          measureTooltipElement.className = 'tooltip tooltip-static';
          measureTooltip.setOffset([0, -7]);
          sketch = null;
          measureTooltipElement = null;
          createMeasureTooltip();
          ol.Observable.unByKey(listener);
        }, this);
  }

  function createMeasureTooltip() {
    if (measureTooltipElement) {
      measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';
    measureTooltip = new ol.Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
    measureTooltips.push(measureTooltip);
  }

  addInteraction();
};


function disableMeasureTool(map, { layer }) {
  layer.setSource(null);
  measureTooltips.forEach(tt => map.removeOverlay(tt));
  map.removeInteraction(draw);
}


export function toggleMeasureTool(ol, map, data) {
  if (data.enable)
    return enableMeasureTool(ol, map, data);
  else
    return disableMeasureTool(map, data);
}


const MeasureToolButton = ({ enableMeasureTool, clearAll }) => (
  <div style={{height: 40, width: 80, position: 'absolute', top: 14, left: 547, backgroundColor: 'white', padding: 2, display: 'flex', flexDirection: 'row'}}>
    <FlatButton id='rem-map-clear_all' tooltip='Clear All' icon='layers_clear' onClick={clearAll} />
    <img src={icon} style={{maxHeight: 26, maxWidth: 26, margin: 5}} onClick={enableMeasureTool}/>
  </div>
);

export default compose(
  connect(
    state => ({
      ui: state.ui
    }),
    dispatch => ({
      setUi: (key, value) => dispatch(setUi(key, value))
    })
  ),

  withHandlers({
    enableMeasureTool: props => _ => props.setUi(MEASURE_TOOL_KEY, true),
    clearAll: props => _ => {
      props.setUi(MEASURE_TOOL_KEY, false);
    }
  })

)(MeasureToolButton);
