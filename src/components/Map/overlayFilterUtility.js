import { chartColors } from 'store/globalObject';
import { getStyle} from 'components/ext/openlayers/utilities';


const hasOverlay = activeOverlays => (activeOverlays !== undefined && activeOverlays.length > 0);


const computeOverlayColors = ({ activeOverlays, allOverlays }) =>
  hasOverlay(activeOverlays) && allOverlays[+activeOverlays[0]].values.reduce((acc, cv, i) => Object.assign(acc, {[cv.label]: chartColors[i%20]}), {});


const getOverlayLabel = ({ activeOverlays, allOverlays }) => hasOverlay(activeOverlays) && allOverlays[+activeOverlays[0]].alias;


const getOverlaySurveyId = ({ activeOverlays, allOverlays }) => hasOverlay(activeOverlays) && +allOverlays[+activeOverlays[0]].survey;


const getFeatureMap = surveyFeatures => surveyFeatures.features.reduce((acc, cv) => Object.assign(acc, {[cv.properties._id]: cv.properties}), {} );


const fixEmpty = value => !value ? 'N/A' : value;


const getFeatureValue = (features, field, id) => features && features[id] && fixEmpty(features[id][field]);


function computeOverlayCounts({ activeOverlays, allOverlays, features, colorMap, surveyFeatures }) {
  if (!hasOverlay(activeOverlays))
    return;

  const overlayField = allOverlays[+activeOverlays[0]].name;
  const overlayCounts = Object.keys(colorMap).reduce((acc, cv) => Object.assign (acc, {[cv]: 0}), {});
  features.forEach (f => {
    const overlayValue = getFeatureValue(surveyFeatures, overlayField, f.get ('_id'));
      overlayCounts[overlayValue]++;
  });
  return overlayCounts;
}


const getOverlayStyle = ({ ol, featureType, activeOverlays, allOverlays, colorMap, surveyFeatures }) => {
  if (!hasOverlay(activeOverlays))
    return getStyle(ol, featureType);

  const overlayField = allOverlays[+activeOverlays[0]].name;
  return f => {
    const overlayValue = getFeatureValue(surveyFeatures, overlayField, f.get ('_id'));
    if (featureType === 'Point') {
      return new ol.style.Style ({
        image: new ol.style.RegularShape ({
          radius: 10,
          angle: Math.PI / 4,
          points: 4,
          stroke: new ol.style.Stroke({ color: '#D52700', width: 0.5 }),
          fill: new ol.style.Fill({ color: colorMap[overlayValue] })
        })
      });
    } else {
      return new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#D52700', width: 0.5 }),
        fill: new ol.style.Fill({ color: colorMap[overlayValue] })
      });
    }
  }
};


function filter ({ activeFilters, allFilters, baseline, featureMap }) {
  let filtered = baseline;

  Object.keys(activeFilters).forEach (filterId => {
    const filterValues = activeFilters[filterId];
    if (filterValues === undefined)
      return;

    const field = allFilters[filterId].name;
    const survey = +allFilters[filterId].survey;
    if (featureMap[survey] === undefined)
      return;

    const mapped = featureMap[survey];
    filtered = filtered.filter (x => mapped[x.get('_id')] && filterValues.includes(mapped[x.get('_id')][field]));
  });
  return filtered;
}


export {
  computeOverlayColors,
  computeOverlayCounts,
  getOverlayStyle,
  getOverlayLabel,
  getOverlaySurveyId,
  getFeatureMap,
  filter,
};
