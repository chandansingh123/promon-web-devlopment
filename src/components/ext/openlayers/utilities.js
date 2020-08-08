
const DEFAULT_FILL_COLOR = '#C7F400';


const renderGeojson = (ol, map, geojson, auxiliary) => {
  if (Object.keys(geojson).length === 0)
    return;

  const features = new ol.format.GeoJSON().readFeatures (geojson, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });
  const geometryFeatures = features.filter(f => !!f.getGeometry());
  if (geometryFeatures.length === 0)
    return;

  const featureType = geometryFeatures[0].getGeometry().getType();
  const style = getStyle(ol, featureType, {
    color: auxiliary.color || DEFAULT_FILL_COLOR
  });
  const source = new ol.source.Vector({ features, projection:'ESPG:4326' });
  if (auxiliary.layer) {
    auxiliary.layer.setSource(source);
    auxiliary.layer.setStyle(style);
    auxiliary.layer.setZIndex(100);
    zoomToProjectArea (map, auxiliary.layer);
    return auxiliary.layer;
  } else {
    const layer = new ol.layer.Vector({ source, style });
    map.addLayer (layer);
    zoomToProjectArea (map, layer);
    return layer;
  }
}


function zoomToProjectArea (map, layer) {
  if (!layer || !map)
    return;

  const source = layer.getSource ();
  if (source.getFeatures().length !== 0) {
    map.getView ().fit (source.getExtent (), map.getSize ());
  }
}

function getStyle (ol, type, auxiliary) {
  const color = (auxiliary && auxiliary.color) || DEFAULT_FILL_COLOR;

  if (type === 'Point')
    return new ol.style.Style ({
      image: new ol.style.RegularShape ({
        radius: 10,
        angle: Math.PI / 4,
        points: 4,
        stroke: new ol.style.Stroke({ color: '#D52700', width: 0.5 }),
        fill: new ol.style.Fill({ color })
      })
    });
  else
    return new ol.style.Style({
      stroke: new ol.style.Stroke({ color: '#D52700', width: 0.5 }),
      fill: new ol.style.Fill({ color })
    });
}


export {
  renderGeojson,
  getStyle,
  zoomToProjectArea
}