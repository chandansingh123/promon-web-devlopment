
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ol from 'openlayers';
import $ from 'jquery';

import config from 'config/config';
import * as actionCreators from 'actions/userActions';
import ProjectSummary from './ProjectSummary';
import SearchBar from './SearchBar';
import MapControl from './MapControl';
import PopUp from './PopUp';
import MapImage from './MapImage';
import Loading from 'components/Common/Loading';
import AnalysisSection, { AOI_POINT_KEY, AOI_POLYGON_KEY, MAP_AOI_ANALYSIS, AOI_POINT_DISTANCE } from './AnalysisSection';
import { addAoiLayer, toggleAoiPointLayer, toggleAoiPolygonLayer } from 'components/ext/openlayers/aoi';
import { OVERLAYS_ACTIVE } from './DrawerOverlaySection';
import { FILTERS_ACTIVE } from './Filter';
import { computeOverlayCounts, getOverlayStyle, computeOverlayColors,
          getOverlayLabel, getOverlaySurveyId, getFeatureMap, filter } from './overlayFilterUtility';
import MeasureToolButton, { addMeasureToolLayer, toggleMeasureTool, MEASURE_TOOL_KEY } from './MeasureTool';


class GeoMap extends React.Component{

  constructor (props) {
    super(props);
    this.map = null;
    this.osmLayer = null;
    this.layer = undefined;
    this.highlightLayer = undefined;
    this.renderBaseline.bind(this);
    this.popUpElement = null;
    this.baseLayers = {};
    this.searchMapping = {};
    this.projectBaseLayer = null;
    this.projectBaseLayers = {};
    this.aoiLayer = null;
    this.surveys = {};

    this.displayPopUp = this.displayPopUp.bind (this);
    this.highlightHouse = this.highlightHouse.bind (this);
    this.searchFeature = this.searchFeature.bind (this);
    this.renderProjectBaseLayer = this.renderProjectBaseLayer.bind(this);
    this.getAoiLayer = this.getAoiLayer.bind(this);
  }

  componentWillMount () {
    if (this.props.map.baseLineLayer) {
      this.downloadLayer (this.props.map.baseLineLayer);
    }
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.gis.data.baseline && this.props.gis.data !== nextProps.gis.data) {
      this.renderBaseline (nextProps);
    }

    if (this.props.session['map.baselayer'] !== nextProps.session['map.baselayer'])
      this.displayLayer (nextProps.session['map.baselayer']);

    if ((this.props.ui[OVERLAYS_ACTIVE] !== nextProps.ui[OVERLAYS_ACTIVE]) ||
        (this.props.ui[FILTERS_ACTIVE] !== nextProps.ui[FILTERS_ACTIVE])) {
      this.renderBaseline(nextProps);
    }

    if (this.props.map.filteredFeatures !== nextProps.map.filteredFeatures){
      this.renderBaseline (nextProps);
    }

    if (this.props.surveys.data !== nextProps.surveys.data) {
      this.renderBaseline (nextProps);
    }

    if (this.props.map.filters !== nextProps.map.filters) {
      this.renderBaseline (nextProps);
    }

    if (this.props.session['map.project.baseLayers'] !== nextProps.session['map.project.baseLayers'] )
      this.renderProjectBaseLayer(nextProps.session.projectCode, nextProps.session['map.project.baseLayers'])

    if (this.props.ui[AOI_POINT_KEY] !== nextProps.ui[AOI_POINT_KEY]) {
      this.aoiPointDrawTool = toggleAoiPointLayer(ol, this.map, {
        projectCode: this.props.session.projectCode,
        aoiSource: this.aoiSource,
        distance: +this.props.ui[AOI_POINT_DISTANCE] || 1000,
        enable: nextProps.ui[AOI_POINT_KEY],
        aoiDrawTool: this.aoiPointDrawTool,
        callback: this.props.setAoi
      }, this.getAoiLayer());
    }
    if (this.props.ui[AOI_POLYGON_KEY] !== nextProps.ui[AOI_POLYGON_KEY]) {
      this.aoiPolygonDrawTool = toggleAoiPolygonLayer(ol, this.map, {
        projectCode: this.props.session.projectCode,
        aoiSource: this.aoiSource,
        enable: nextProps.ui[AOI_POLYGON_KEY],
        aoiDrawTool: this.aoiPolygonDrawTool,
        callback: this.props.setAoi
      }, this.getAoiLayer());
    }
    if (this.props.ui[MAP_AOI_ANALYSIS] !== nextProps.ui[MAP_AOI_ANALYSIS] && this.props.ui[MAP_AOI_ANALYSIS] === false)
      toggleAoiPointLayer(ol, this.map, {
        enable: false,
        layer: this.aoiLayer
      });

    if (this.props.ui[MEASURE_TOOL_KEY] !== nextProps.ui[MEASURE_TOOL_KEY]) {
      toggleMeasureTool(ol, this.map, {
        layer: this.measureToolLayer,
        enable: nextProps.ui[MEASURE_TOOL_KEY],
        tooltips: this.measureTooltips
      });
    }
  }

  componentDidMount () {
    this.renderMap ();
    if (this.props.gis.data.baseline)
      this.renderBaseline (this.props);
  }

  componentWillUpdate (nextProps) {
    this.map.updateSize ();

    if (nextProps.session['map.popup'])
      this.highlightHouse();
  }

  getAoiLayer() {
    if (!this.aoiLayer) {
      this.aoiLayer = new ol.layer.Vector();
      this.map.addLayer(this.aoiLayer);
    }
    return this.aoiLayer;
  }

  displayLayer (layerName) {
    var baseLayers = this.baseLayers;
    Object.keys(baseLayers).forEach(function(key){
      if (layerName === key) {
        baseLayers[key].setVisible(true);
      } else {
        baseLayers[key].setVisible(false);
      }
    });
  }

  addDivControl (info) {
    const addDiv = function(opt_options) {
      ol.control.Control.call(this, {
          element: document.getElementById(info.divId)
      });
    };
    ol.inherits(addDiv, ol.control.Control);
    const divControl = new addDiv ();
    this.map.addControl(divControl);
  }

  zoomToProjectArea () {
    if (this.layer) {
      const source = this.layer.getSource ();
      if (source.getFeatures().length !== 0) {
        this.map.getView ().fit (source.getExtent (), this.map.getSize ());
      }
    }
  }

  zoomIn () {
    this.map.getView().setZoom(this.map.getView().getZoom() + 1);
  }

  zoomOut () {
    this.map.getView().setZoom(this.map.getView().getZoom() - 1);
  }

  renderProjectBaseLayer(projectCode, layers) {
    Object.keys(layers).forEach(layer => {
      if (layers[layer] === false && this.projectBaseLayers[layer])
        this.map.removeLayer(this.projectBaseLayers[layer]);

      // Download layer
      if (layers[layer] === true && !this.projectBaseLayers[layer]) {
        const url = `${config.backend.url}/${this.props.session.country.code}/projects/${projectCode}/base-layers/${layer}`;
        const source = new ol.source.Vector ({ url, projection:'ESPG:4326', format: new ol.format.GeoJSON() });
        const style = new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
          })
        });
        this.projectBaseLayers[layer] = new ol.layer.Vector({ source, style });
        this.projectBaseLayers[layer].set('name', `project-base-${layer}`);
      }

      const mapLayers = this.map.getLayers().getArray().map(l => l.get('name'));
      if (layers[layer] === true && this.projectBaseLayers[layer] && mapLayers.indexOf(`project-base-${layer}`) === -1)
        this.map.addLayer(this.projectBaseLayers[layer]);
    });
  }

  renderBaseline (props) {
    props = props ? props : this.props;

    this.map.removeLayer(this.layer);
    this.layer = undefined;

    // Set filtered features
    const activeFilters = props.ui[FILTERS_ACTIVE] || {};
    Object.keys(activeFilters).forEach(af => {
      const surveyId = +props.filters.data[+af].survey;
      if (!this.surveys[surveyId] && props.gis.data[surveyId])
        this.surveys[surveyId] = getFeatureMap (props.gis.data[surveyId]);
    });
    if (this.baseline) {
      this.features = filter ({
        activeFilters: props.ui[FILTERS_ACTIVE] || {},
        allFilters: props.filters.data,
        baseline: this.baseline,
        featureMap: this.surveys
      });
    }

    let features = this.features;
    if (!features && props.gis.data.baseline) {
      features = new ol.format.GeoJSON().readFeatures (props.gis.data.baseline, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });
      this.baseline = features;
    }
    if (features === undefined)
      return;
    const hasFeatures = features.find(f => !!f.getGeometry());
    if (!hasFeatures)
      return;

    // Set autocomplete values from current feature list
    const autoCompleteValue = {};
    let featureType = 'Polygon';
    features.forEach(function (feature) {
      featureType = feature.getGeometry() ? feature.getGeometry().getType() : featureType;
      const idx = feature.get ('_id');
      if (idx) {
        autoCompleteValue[feature.get('_id')] = idx;
        if (feature.get('_notes_hh_code')) autoCompleteValue[feature.get('_notes_hh_code')] = idx;
        if (feature.get('_general_info_registration_number')) autoCompleteValue[feature.get('_general_info_registration_number')] = idx;
      }
    });
    this.searchMapping = autoCompleteValue;
    this.setAutoCompleteValue(autoCompleteValue);

    // Overlay computations
    const activeOverlays = props.ui[OVERLAYS_ACTIVE];
    const allOverlays = props.overlays.data;
    const overlaySurveyId = getOverlaySurveyId({ activeOverlays, allOverlays });
    if (!this.surveys[overlaySurveyId] && props.gis.data[overlaySurveyId])
      this.surveys[overlaySurveyId] = getFeatureMap (props.gis.data[overlaySurveyId]);
    const surveyFeatures = this.surveys[overlaySurveyId];
    const colorMap = computeOverlayColors({ activeOverlays, allOverlays });

    const source = new ol.source.Vector ({ features, projection:'ESPG:4326' });
    const layer = new ol.layer.Vector ({
      source,
      style: getOverlayStyle({ ol, featureType, activeOverlays, allOverlays, colorMap, surveyFeatures })
    });
    this.map.addLayer(layer);
    this.zoomToProjectArea ();

    const project = props.session.projects.find(p => p.code === props.session.projectCode);
    this.updateSummary({
      features,
      overlayColors: colorMap,
      overlayCounts: computeOverlayCounts({ activeOverlays, allOverlays, features, colorMap, surveyFeatures }),
      overlayLabel: getOverlayLabel({ activeOverlays, allOverlays }) || (project ? project.name : '')
    });

    this.layer = layer;
    this.zoomToProjectArea ();
  }

  updateSummary ({features, overlayColors, overlayCounts, overlayLabel}) {
    const projectSummary = {
      projectName: overlayLabel,
      totalHouseHold: features.length,
      overlayColors,
      overlayCounts
    };
    this.props.updateProjectSummary (projectSummary);
  }

  renderMap () {
    const country = this.props.session.country;
    const center_long = (+country.min_longitude + +country.max_longitude)/2;
    const center_lat = (+country.min_latitude + +country.max_latitude)/2 ;
    const centre = [center_long, center_lat];
    let view = new ol.View({
      center: centre,
      zoom: 6,
      minZoom: 6,
      maxZoom: 18
    });

    let map = new ol.Map({
      target: 'rem-map-container',
      controls: ol.control.defaults ({
        attribution : false,
        zoom : false,
      }),
      view: view
    });

    let extent = ol.extent.boundingExtent([[+country.min_longitude, +country.min_latitude], [+country.max_longitude, +country.max_latitude]]);
    extent = ol.proj.transformExtent(extent, ol.proj.get('EPSG:4326'), ol.proj.get('EPSG:3857'));
    map.getView().fit(extent, map.getSize());

    let osmLayer = new ol.layer.Tile({
      source: new ol.source.OSM(),
      isBaseLayer: true,
    });
    map.addLayer(osmLayer);

    map.addControl (new ol.control.Zoom ({
      className: 'pm-map-controls pm-map-zoom'
    }));

    map.addControl (new ol.control.ScaleLine());

    map.addControl (new ol.control.MousePosition({
      coordinateFormat:ol.coordinate.createStringXY(4),
      projection:'EPSG:4326',
      undefinedHTML:''
    }));

    const { aoiLayer, aoiSource } = addAoiLayer(ol, map);
    this.aoiLayer = aoiLayer;
    this.aoiSource = aoiSource;

    map.once('postrender', this.postRender.bind(this));

    this.map = map;
    this.addBaseLayers();

    const { measureToolLayer } = addMeasureToolLayer(ol, map);
    this.measureToolLayer = measureToolLayer;
  }

  addBaseLayers () {
    const osmLayer = new ol.layer.Tile({
      source: new ol.source.OSM(),
      isBaseLayer: true
    });
    this.props.map.osmLayer = osmLayer;

    this.map.addLayer(osmLayer);

    const bingMapLayer = new ol.layer.Tile({
      source: new ol.source.BingMaps({
        key: config.bingMap.key,
        imagerySet: 'AerialWithLabels',
      }),
      isBaseLayer: true
    });

    const esriMapLayer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
      }),
    });

    esriMapLayer.setVisible(false);
    bingMapLayer.setVisible(false);
    this.map.addLayer(bingMapLayer);
    this.map.addLayer(esriMapLayer);
    this.baseLayers.OSM = osmLayer;
    this.baseLayers.Bing = bingMapLayer;
    this.baseLayers.Esri = esriMapLayer;
    this.props.updateBaseLayers(Object.keys(this.baseLayers));
  }

  postRender () {
    const panel = new ol.control.Control({ element: document.getElementById('pm-map-control-container') });
    this.map.addControl(panel);
    document.getElementById('project-extent-zoom').addEventListener('click', this.zoomToProjectArea.bind(this));
    document.getElementById('zoom-in-map').addEventListener('click', this.zoomIn.bind(this));
    document.getElementById('zoom-out-map').addEventListener('click', this.zoomOut.bind(this));

    this.map.on('click', function(evt) {
      const feature = this.map.forEachFeatureAtPixel(evt.pixel, feature => feature);
      if (feature) {
        this.displayPopUp (feature);
      } else {
        this.closePopUp ();
      }
    }.bind(this));
  }

  setAutoCompleteValue (autoCompleteValue) {
    $('#map-search-text').autocomplete ({
      source: Object.keys(autoCompleteValue),
      select: ((event, ui) => (ui.item && this.searchFeature (event)))
    });
  }

  searchFeature (event) {
    event.preventDefault();
    if (event.type !== "submit")
      return;

    const searchValue = document.getElementById('map-search-text').value;
    const householdId = this.searchMapping[searchValue];
    this.props.setSession ('map.popup', householdId);
    this.props.fetchUserHouseHoldSummary (this.props.session.projectCode, householdId);
  }

  highlightHouse () {
    const id = this.props.session['map.popup'];
    if (!id)
      return;

    const baselineSurvey = Object.values (this.props.surveys.data).filter(s => s.baseline)[0];
    if (!baselineSurvey)
      return;

    // Remove old layer from map
    if (this.highlightLayer) {
      this.map.removeLayer(this.highlightLayer);
    }

    const features = this.baseline;
    const feature = features.filter (f => f.get('_id') === id);
    if (feature.length === 0)
      return;
    if (!feature[0].getGeometry()) {
      // TODO display message to indicate hh does not have geo-info
      console.log ('Point does not exist.');
      return;
    }

    // Add layer to highlight selected house
    const source = new ol.source.Vector ({ features: feature });
    let style;
    const featureType = feature[0].getGeometry().getType();
    if (featureType === 'Point') {
      style = new ol.style.Style ({
        image: new ol.style.RegularShape ({
          radius: 10,
          angle: Math.PI / 4,
          points: 4,
          stroke: new ol.style.Stroke({ color: '#00FFFF', width: 2 }),
          fill: new ol.style.Fill ({ color: 'black' })
        })
      });
    } else {
      style = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#00FFFF', width: 2 }),
        fill: new ol.style.Fill ({ color: 'black' })
      });
    }

    const  highlightOverlay = new ol.layer.Vector({
      style: style,
      source: source,
    });
    this.highlightLayer = highlightOverlay;
    this.map.addLayer(highlightOverlay);

    const center = this.getLocation(feature[0]);
    if (center) {
      this.map.getView ().setZoom(18);
      this.map.getView ().setCenter (center);
    }
  }

  displayPopUp (feature) {
    let householdId = feature.get('_id');
    this.props.setSession ('map.popup', householdId);
    this.props.fetchUserHouseHoldSummary (this.props.session.projectCode, householdId);
  }

  closePopUp () {
    // Remove old layer from map
    if (this.highlightLayer) {
      this.map.removeLayer(this.highlightLayer);
    }

    this.props.setSession ('map.popup', '');
  }

  getLocation (feature) {
    const geometry = feature.getGeometry();
    if (!geometry)
      return;

    let coordinates = geometry.getCoordinates ();
    if (Array.isArray (coordinates) && Array.isArray (coordinates[0]) && Array.isArray (coordinates[0][0]))
      coordinates = coordinates[0][0];
    return coordinates;
  }

  render () {
    return (
      <div>
        <div id="rem-map-container" style={{width: '100vw', height: 'calc(100vh - 44px)'}}/>

        { this.props.map.isFetchin &&
          <div style={{position: 'absolute', zIndex:1,  width: '100%', height: '100%',top: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.1)'}}>
            <Loading style={{height:'80vh'}} viewBox='0 0 38 38'/>
          </div>
        }

        <MapControl />
        <SearchBar drawerMenuClickCallBack={() => this.props.setUi('map.drawerShow', true)} submitCallback={this.searchFeature}
            setSession={this.props.setSession} session={this.props.session} />
        
        <AnalysisSection />
        <MeasureToolButton />

        <ProjectSummary />
        <PopUp visible={this.props.session['map.popup']}  houseHoldData={this.props.household.data[this.props.session['map.popup']]}
            data={this.props.popup.data} projectCode={this.props.session.projectCode} householdId={this.props.session['map.popup']}
            setSession={this.props.setSession} />
        { this.props.session['map.image'] && <MapImage /> }

        <div className='pm-map-coordinate-contianer' id='pm-map-coorinate-contianer' style={{bottom:'0px',left:'0px', position:'absolute', background:'#fff'}}/>
      </div>
    );
  }
}


export default compose (
  connect (
    state => ({...state}),
    dispatch => bindActionCreators (actionCreators, dispatch)
  )

) (GeoMap);
