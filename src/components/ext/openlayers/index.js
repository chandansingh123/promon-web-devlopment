
import React from 'react';

import * as utilities from './utilities';

class OLWrapper extends React.Component {

  constructor (props) {
    super (props);
    this.ol = undefined;
    this.map = undefined;
    this.baselineLayer = undefined;
  }

  componentDidMount () {
    import ('openlayers')
      .then (ol => this.renderMap (ol))
      .catch(err => {
        console.log ('There was an error loading maps.', err);
      });
  }

  componentDidUpdate () {
    // render points
    if (this.ol) {
      if (this.props.pointSet)
        this.renderPoints (this.props.pointSet);
      else if (this.props.point)
        this.renderPoint (this.props.point);
      else if (this.props.baseline)
        this.renderBaseline (this.props.baseline);
    }
  }

  renderMap (ol) {

    // compute map extent and center
    let center = [0, 0], extent;
    if (this.props.extent) {
      const corner1 = ol.proj.transform ([+this.props.extent[0], +this.props.extent[1]], 'EPSG:4326', 'EPSG:3857')
      const corner2 = ol.proj.transform ([+this.props.extent[2], +this.props.extent[3]], 'EPSG:4326', 'EPSG:3857')
      extent = [...corner1, ...corner2];
      center = [(corner1[0] + corner2[0]) / 2, (corner1[1] + corner2[1]) / 2];
    }

    // set map base layer
    const baseLayer = new ol.layer.Tile({
      source: new ol.source.OSM(),
      isBaseLayer: true,
    });

    // render map
    const map = new ol.Map({
      target: this.props.id,
      layers: [baseLayer],
      view: new ol.View ({ center }),
      controls: ol.control.defaults ({
        attribution : false,
        zoom : false,
      }),
    });
    if (extent)
      map.getView().fit(extent, map.getSize());

    // save values in class
    this.ol = ol;
    this.map = map;

    // render points
    if (this.props.pointSet)
      this.renderPoints (this.props.pointSet);
    else if (this.props.point)
      this.renderPoint (this.props.point);
    else if (this.props.baseline)
      this.renderBaseline (this.props.baseline);
  }

  renderBaseline (baseline) {
    const { ol, map } = this;

    if (Object.keys(baseline).length === 0)
      return;

    const features = new ol.format.GeoJSON().readFeatures (baseline, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
    const geometryFeatures = features.filter(f => !!f.getGeometry());

    if (geometryFeatures.length === 0) {
      if (this.baselineLayer)
        map.removeLayer(this.baselineLayer);
      return;
    }

    const featureType = geometryFeatures[0].getGeometry().getType();
    const style = utilities.getStyle(ol, featureType);
    const source = new ol.source.Vector({ features, projection:'ESPG:4326' });
    if (this.baselineLayer) {
      this.baselineLayer.setSource(source);
      this.baselineLayer.setStyle(style);
      utilities.zoomToProjectArea (map, this.baselineLayer);
    } else {
      this.baselineLayer = new ol.layer.Vector({ source, style });
      map.addLayer (this.baselineLayer);
      utilities.zoomToProjectArea (map, this.baselineLayer);
    }
  }

  getColorArray (code) {
    const str2int = str => parseInt('0x' + str, 16);
    return [
      str2int (code.substring(1,3)),
      str2int (code.substring(3,5)),
      str2int (code.substring(5)),
      0.5
    ];
  }

  renderPoints (pointSet) {
    const { ol, map } = this;

    // Set style for each point-set
    pointSet.forEach (ps => {
      const styleFn = (feature) => new ol.style.Style ({
        image: new ol.style.Circle ({
          radius: 16,
          stroke: new ol.style.Stroke({ color: '#D52700', width: 0.5 }),
          fill: new ol.style.Fill({ color: this.getColorArray(ps.color) })
        }),
        text: new ol.style.Text({
          text: feature.get('features').length.toString(),
          fill: new ol.style.Fill ({ color: '#fff' }),
          stroke: new ol.style.Stroke ({ color: 'rgba(0, 0, 0, 0.6)', width: 3 })
        })
      });

      const features = ps.points.filter(p => !!p).map (p => new ol.Feature(new ol.geom.Point(ol.proj.transform (p, 'EPSG:4326', 'EPSG:3857'))));
      const source = new ol.source.Vector ({ features, projection: 'ESPG:4326' });
      const clusterSource = new ol.source.Cluster({ distance: 30, source });
      const layer = new ol.layer.Vector({ source: clusterSource, style: styleFn });
      map.addLayer (layer);
    });
  }

  renderPoint (point) {
    const { ol, map } = this;

    // Set style for each point-set
    const style = new ol.style.Style ({
      image: new ol.style.Circle ({
        radius: 5,
        stroke: new ol.style.Stroke({ color: '#D52700', width: 0.5 }),
        fill: new ol.style.Fill({ color: '#C7F400' })
      })
    });
    const feature = new ol.Feature(new ol.geom.Point(ol.proj.transform (point, 'EPSG:4326', 'EPSG:3857')));
    const source = new ol.source.Vector ({ features: [feature], projection: 'ESPG:4326' });
    const layer = new ol.layer.Vector({ source, style });
    map.addLayer (layer);
  }

  render () {
    return <div id={this.props.id} style={this.props.style} />;
  }
}

export default OLWrapper;
