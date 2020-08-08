
import {chartColors} from 'store/globalObject';
import { fetchUserSurveyGeojson } from './projectUserAction';

export function updateSearchValue(searchValue){
    return {
        type: "UPDATE_SEARCH_TEXT",
        searchValue
    }
}

export function updateAutoCompleteValue(autoCompleteValue){
    return{
        type:"UPDATE_AUTO_COMPLETE_VALUE",
        autoCompleteValue
    }
}

export function updatePopUpDetail(popUpDetail){
    return{
        type:"UPDATE_POP_UP_DETAIL",
        popUpDetail
    }
}

export function updateProjectSummary(projectSummary){
    return{
        type:"UPDATE_PROJECT_SUMMARY",
        projectSummary
    }
}

export function updateBaseLayers(baseLayers){
    return{
        type:"UPDATE_BASE_LAYERS",
        baseLayers
    }
}


// Actions related to Overlays

export function toggleOverlayInMap (overlayId, currentOverlays, overlays) {
  let overlayIndex;
  return function (dispatch) {
    if (currentOverlays.indexOf (overlayId) === -1) {
      dispatch (addOverlayToMap (overlayId));
      overlayIndex = overlayId;
    } else {
      dispatch (removeOverlayFromMap (overlayId));
      if (currentOverlays[0] === overlayId)
        overlayIndex = currentOverlays.length === 1 ? -1 : currentOverlays[1];
      else
        overlayIndex = currentOverlays[0];
    }

    // compute overlay colors
    if (overlayIndex !== -1) {
        let overlayColors = {};

        overlays[overlayIndex].values.map ((x, i) => overlayColors[x.label] = chartColors[i]);
        dispatch (updateOverlayColors (overlayColors));
    } else {
        dispatch (updateOverlayColors ({}));
    }
  }
}

const removeOverlayFromMap = (overlayId) => ({type: 'REMOVE_OVERLAY_FROM_MAP', overlayId});
const addOverlayToMap = (overlayId) => ({type: 'ADD_OVERLAY_TO_MAP', overlayId});
const updateOverlayColors = (overlayColors)=> ({ type: 'UPDATE_OVERLAY_COLORS', overlayColors});


// Actions related to Filters

// export function addFilterInMap (filterId, value, filters, surveys, currentFilters, projectCode) {
//   return function (dispatch) {

//     // Add filter to Redux state
//     const fvAdded = currentFilters[filterId] ? [...currentFilters[filterId], value] : [value];
//     currentFilters = {...currentFilters, [filterId]: fvAdded};
//     dispatch ( setFilterInMap (currentFilters));
//     dispatch (fetchUserSurveyGeojson (projectCode, filters[filterId].survey));
//   }
// }

// export function removeFilterFromMap (filterId, value, filters, surveys, currentFilters) {
//   return function (dispatch) {

//     // Remove filter to Redux state
//     let fvRemoved = currentFilters[filterId].filter (fv => fv !== value);
//     if (fvRemoved.length === 0)
//         fvRemoved = undefined;
//     currentFilters = {...currentFilters, [filterId]: fvRemoved};
//     dispatch ( setFilterInMap (currentFilters));
//   }
// }

export const setfilteredFeatures = (filteredFeatures) => ({type: 'SET_FILTERED_FEATURES', filteredFeatures});
// const setFilterInMap = (filters) => ({type: 'SET_FILTER_IN_MAP', filters});


export function updateFeatureCache(features){
    return{
        type:'UPDATE_FEATURE_CACHE',
        features
    }
}