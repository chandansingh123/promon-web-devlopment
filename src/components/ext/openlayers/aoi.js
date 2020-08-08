import request from 'superagent';

import config from 'config/config';
import { renderGeojson } from './utilities';

export const addAoiLayer = (ol, map) => {
  const aoiSource = new ol.source.Vector();
  const aoiLayer = new ol.layer.Vector({
    source: aoiSource,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 0, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: "#ffcc33",
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: "#ffcc33"
        })
      })
    })
  });
  map.addLayer(aoiLayer);

  return { aoiLayer, aoiSource };
};

const enableAoiPointLayer = (ol, map, payload, aoiLayer) => {
  map.getViewport().style.cursor = 'crosshair';

  const { projectCode, distance, aoiSource } = payload;

  let geometryFunction, maxPoints;
  const drawTool = new ol.interaction.Draw({
    source: aoiSource,
    type: 'Point',
    geometryFunction: geometryFunction,
    maxPoints: maxPoints
  });

  drawTool.on('drawend', function(e) {
    map.getViewport().style.cursor = 'pointer';

    const lastFeature = e.feature;
    const format = new ol.format.WKT();
    const point = format.writeGeometry(lastFeature.getGeometry().transform('EPSG:3857', 'EPSG:4326'));

    const url = `${config.backend.url}/user/projects/${projectCode}/aoipoint`;
    const token = localStorage.getItem('token');
    request.get(url)
      .set('Authorization',`Token ${token}`)
      .query({ point, distance })
      .end((error,response) => {
        if(!error && response) {
          if (response.body)
            renderGeojson(ol, map, response.body, {color: '#3F003F', layer: aoiLayer});
          if (payload.callback)
            payload.callback(response.body);
        } else {
          console.log('There is an error while saving data');
        }
      });
      drawTool.setActive(false);
      map.removeInteraction(drawTool);
    });

  drawTool.on('drawstart', _ => aoiSource.clear());
  map.addInteraction(drawTool);
  return drawTool;
}

const enableAoiPolygonLayer = (ol, map, payload, aoiLayer) => {
  map.getViewport().style.cursor = 'crosshair';

  const { projectCode, aoiSource }  = payload;

  let geometryFunction, maxPoints;
  const drawTool = new ol.interaction.Draw({
    source: aoiSource,
    type: 'Polygon',
    geometryFunction: geometryFunction,
    maxPoints: maxPoints
  });

  drawTool.on('drawend', function(e) {
    map.getViewport().style.cursor = 'pointer';

    const lastFeature = e.feature;
    const format = new ol.format.WKT();
    const polygon = format.writeGeometry(lastFeature.getGeometry().transform('EPSG:3857', 'EPSG:4326'));

    const url = `${config.backend.url}/user/projects/${projectCode}/aoipolygon`;
    const token = localStorage.getItem('token');
    request.get(url)
      .set('Authorization',`Token ${token}`)
      .query({ polygon })
      .end((error,response) => {
        if(!error && response) {
          renderGeojson(ol, map, response.body, {color: '#3F003F', layer: aoiLayer});
          if (payload.callback)
            payload.callback(response.body);
        } else {
          console.log('There is an error while saving data');
        }
      });
    drawTool.setActive(false);
    map.removeInteraction(drawTool);
    });

  drawTool.on('drawstart', _ => aoiSource.clear());
  map.addInteraction(drawTool);
}

const disableAoiLayer = (map, payload) => {
  if (payload.layer)
    map.removeLayer(payload.layer);
};

export const toggleAoiPointLayer = (ol, map, payload, aoiLayer) => {
  if (payload.enable)
    return enableAoiPointLayer(ol, map, payload, aoiLayer);
  else
    return disableAoiLayer(map, payload);
}

export const toggleAoiPolygonLayer = (ol, map, payload, aoiLayer) => {
  if (payload.enable)
    return enableAoiPolygonLayer(ol, map, payload, aoiLayer);
  else
    return disableAoiLayer(map, payload);
}
